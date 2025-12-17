import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2, Eye } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { Answer, Question } from "@/types";

const QuestionRenderer = ({
  question,
  onAnswer,
  currentAnswer,
}: {
  question: Question;
  onAnswer: (value: string | string[] | number | boolean) => void;
  currentAnswer?: string | string[] | number | boolean;
}) => {
  const renderSingleChoice = () => (
    <View style={styles.optionsContainer}>
      {question.options?.map((option) => {
        const isSelected = currentAnswer === option;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
            onPress={() => onAnswer(option)}
            activeOpacity={0.7}
          >
            <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
            <Text
              style={[
                styles.optionText,
                isSelected && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderMultipleChoice = () => {
    const selectedOptions = Array.isArray(currentAnswer) ? currentAnswer : [];
    
    return (
      <View style={styles.optionsContainer}>
        {question.options?.map((option) => {
          const isSelected = selectedOptions.includes(option);
          return (
            <TouchableOpacity
              key={option}
              style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
              onPress={() => {
                const newSelection = isSelected
                  ? selectedOptions.filter((o) => o !== option)
                  : [...selectedOptions, option];
                onAnswer(newSelection);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <CheckCircle2 size={20} color="#FFFFFF" />}
              </View>
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderScale = () => {
    const min = question.min || 0;
    const max = question.max || 10;
    const scale = Array.from({ length: max - min + 1 }, (_, i) => i + min);

    return (
      <View style={styles.scaleContainer}>
        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabel}>{min}</Text>
          <Text style={styles.scaleLabel}>{max}</Text>
        </View>
        <View style={styles.scaleButtons}>
          {scale.map((value) => {
            const isSelected = currentAnswer === value;
            return (
              <TouchableOpacity
                key={value}
                style={[
                  styles.scaleButton,
                  isSelected && styles.scaleButtonSelected,
                ]}
                onPress={() => onAnswer(value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.scaleButtonText,
                    isSelected && styles.scaleButtonTextSelected,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderBoolean = () => (
    <View style={styles.booleanContainer}>
      <TouchableOpacity
        style={[
          styles.booleanButton,
          currentAnswer === true && styles.booleanButtonSelected,
        ]}
        onPress={() => onAnswer(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.booleanButtonText,
            currentAnswer === true && styles.booleanButtonTextSelected,
          ]}
        >
          Oui
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.booleanButton,
          currentAnswer === false && styles.booleanButtonSelected,
        ]}
        onPress={() => onAnswer(false)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.booleanButtonText,
            currentAnswer === false && styles.booleanButtonTextSelected,
          ]}
        >
          Non
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.questionCard}>
      <Text style={styles.questionText}>{question.text}</Text>
      {question.type === "single" && renderSingleChoice()}
      {question.type === "multiple" && renderMultipleChoice()}
      {question.type === "scale" && renderScale()}
      {question.type === "boolean" && renderBoolean()}
    </View>
  );
};

export default function SurveyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSurveyById, completeSurvey, hasCompletedSurvey } = useApp();
  
  const survey = getSurveyById(id);
  const alreadyCompleted = hasCompletedSurvey(id);
  
  const [answers, setAnswers] = useState<Answer[]>([]);

  if (!survey) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Sondage introuvable</Text>
      </View>
    );
  }

  const handleAnswer = (questionId: string, value: string | string[] | number | boolean) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = { questionId, value };
        return updated;
      }
      return [...prev, { questionId, value }];
    });
  };

  const getAnswer = (questionId: string) => {
    return answers.find((a) => a.questionId === questionId)?.value;
  };

  const canSubmit = () => {
    const requiredQuestions = survey.questions.filter((q) => q.required);
    return requiredQuestions.every((q) =>
      answers.some((a) => a.questionId === q.id && a.value !== undefined)
    );
  };

  const handleSubmit = () => {
    if (!canSubmit()) {
      Alert.alert("Attention", "Veuillez répondre à toutes les questions obligatoires.");
      return;
    }

    completeSurvey(survey.id, answers);
    Alert.alert(
      "Merci !",
      "Votre participation a été enregistrée. +50 points Kéya !",
      [
        {
          text: "Voir les résultats",
          onPress: () => router.replace(`/results/${survey.id}` as never),
        },
        {
          text: "Retour",
          onPress: () => router.back(),
          style: "cancel",
        },
      ]
    );
  };

  const handleViewResults = () => {
    router.push(`/results/${survey.id}` as never);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {survey.imageUrl && (
          <Image
            source={{ uri: survey.imageUrl }}
            style={styles.headerImage}
            contentFit="cover"
          />
        )}

        <View style={styles.header}>
          <View style={styles.headerBadges}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{survey.category}</Text>
            </View>
            <View style={styles.creatorBadge}>
              <Text style={styles.creatorText}>
                {survey.creatorType === "admin" ? "KéyaKé" : "Entreprise"}
              </Text>
            </View>
          </View>
          <Text style={styles.title}>{survey.title}</Text>
          <Text style={styles.description}>{survey.description}</Text>
          <View style={styles.stats}>
            <Text style={styles.statsText}>
              {survey.participantCount.toLocaleString()} participants
            </Text>
            <Text style={styles.statsText}>•</Text>
            <Text style={styles.statsText}>
              {survey.questions.length}{" "}
              {survey.questions.length === 1 ? "question" : "questions"}
            </Text>
          </View>
        </View>

        {alreadyCompleted ? (
          <View style={styles.completedCard}>
            <CheckCircle2 size={48} color={Colors.light.success} />
            <Text style={styles.completedTitle}>Sondage complété !</Text>
            <Text style={styles.completedText}>
              Vous avez déjà participé à ce sondage.
            </Text>
            <TouchableOpacity
              style={styles.viewResultsButton}
              onPress={handleViewResults}
              activeOpacity={0.7}
            >
              <Eye size={20} color={Colors.light.primary} />
              <Text style={styles.viewResultsButtonText}>Voir les résultats</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.questionsContainer}>
              {survey.questions.map((question, index) => (
                <View key={question.id}>
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionNumber}>Question {index + 1}</Text>
                    {question.required && (
                      <View style={styles.requiredBadge}>
                        <Text style={styles.requiredText}>Obligatoire</Text>
                      </View>
                    )}
                  </View>
                  <QuestionRenderer
                    question={question}
                    onAnswer={(value) => handleAnswer(question.id, value)}
                    currentAnswer={getAnswer(question.id)}
                  />
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                !canSubmit() && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!canSubmit()}
              activeOpacity={0.7}
            >
              <Text style={styles.submitButtonText}>Soumettre mes réponses</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  headerImage: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.light.purple["100"],
  },
  header: {
    padding: 24,
  },
  headerBadges: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: Colors.light.purple["100"],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  creatorBadge: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  creatorText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 12,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statsText: {
    fontSize: 14,
    color: Colors.light.textTertiary,
  },
  questionsContainer: {
    paddingHorizontal: 24,
    gap: 24,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.light.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  requiredBadge: {
    backgroundColor: Colors.light.error + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  requiredText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.light.error,
  },
  questionCard: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 20,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.border,
    gap: 12,
  },
  optionButtonSelected: {
    backgroundColor: Colors.light.purple["100"],
    borderColor: Colors.light.primary,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: Colors.light.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.primary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "500" as const,
  },
  optionTextSelected: {
    color: Colors.light.primary,
    fontWeight: "600" as const,
  },
  scaleContainer: {
    gap: 12,
  },
  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  scaleLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
  scaleButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  scaleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: "center",
    justifyContent: "center",
  },
  scaleButtonSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  scaleButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  scaleButtonTextSelected: {
    color: "#FFFFFF",
  },
  booleanContainer: {
    flexDirection: "row",
    gap: 12,
  },
  booleanButton: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 12,
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: "center",
  },
  booleanButtonSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  booleanButtonText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  booleanButtonTextSelected: {
    color: "#FFFFFF",
  },
  completedCard: {
    margin: 24,
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  completedTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  completedText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  viewResultsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.light.purple["100"],
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  viewResultsButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  submitButton: {
    margin: 24,
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.light.border,
    shadowOpacity: 0,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
});
