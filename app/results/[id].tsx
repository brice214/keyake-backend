import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Share2, TrendingUp, Users } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { SurveyResult } from "@/types";

const AnimatedBar = ({
  label,
  value,
  total,
  color,
  delay,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  delay: number;
}) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: percentage,
      delay,
      useNativeDriver: false,
      tension: 20,
      friction: 7,
    }).start();
  }, [percentage, delay, animatedWidth]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.barContainer}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel} numberOfLines={2}>
          {label}
        </Text>
        <Text style={styles.barValue}>{value} votes</Text>
      </View>
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: color,
              width: widthInterpolation,
            },
          ]}
        />
      </View>
      <Text style={styles.barPercentage}>{percentage.toFixed(1)}%</Text>
    </View>
  );
};

const ResultCard = ({
  result,
  questionText,
  index,
}: {
  result: SurveyResult;
  questionText: string;
  index: number;
}) => {
  const colors = [
    Colors.light.primary,
    Colors.light.accent,
    "#10B981",
    "#3B82F6",
    "#EC4899",
  ];

  const entries = Object.entries(result.votes).sort((a, b) => b[1] - a[1]);

  return (
    <View style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultQuestionNumber}>Question {index + 1}</Text>
        <View style={styles.totalVotesBadge}>
          <Users size={14} color={Colors.light.primary} />
          <Text style={styles.totalVotesText}>
            {result.totalVotes.toLocaleString()} votes
          </Text>
        </View>
      </View>
      <Text style={styles.resultQuestion}>{questionText}</Text>
      <View style={styles.barsContainer}>
        {entries.map(([option, votes], i) => (
          <AnimatedBar
            key={option}
            label={option}
            value={votes}
            total={result.totalVotes}
            color={colors[i % colors.length]}
            delay={i * 100}
          />
        ))}
      </View>
    </View>
  );
};

export default function ResultsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSurveyById } = useApp();

  const survey = getSurveyById(id);

  if (!survey) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Sondage introuvable</Text>
      </View>
    );
  }

  if (!survey.results || survey.results.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Aucun résultat disponible</Text>
        <Text style={styles.errorSubtext}>
          Les résultats seront disponibles une fois que des participants auront répondu
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={Colors.light.primary} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.headerBadge}>
              <TrendingUp size={20} color={Colors.light.primary} />
              <Text style={styles.headerBadgeText}>Résultats en temps réel</Text>
            </View>
            <Text style={styles.title}>{survey.title}</Text>
            <View style={styles.headerStats}>
              <View style={styles.statPill}>
                <Users size={16} color={Colors.light.primary} />
                <Text style={styles.statPillText}>
                  {survey.participantCount.toLocaleString()} participants
                </Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statPillText}>{survey.category}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.shareButton} activeOpacity={0.7}>
            <Share2 size={20} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.resultsContainer}>
          {survey.results.map((result, index) => {
            const question = survey.questions.find((q) => q.id === result.questionId);
            if (!question) return null;

            return (
              <ResultCard
                key={result.questionId}
                result={result}
                questionText={question.text}
                index={index}
              />
            );
          })}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerCard}>
            <Text style={styles.footerTitle}>Merci pour votre participation !</Text>
            <Text style={styles.footerText}>
              Vos opinions comptent. Continuez à partager votre voix sur KéyaKé.
            </Text>
          </View>
        </View>
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
    fontWeight: "600" as const,
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 24,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceCard,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    flex: 1,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  headerBadgeText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 12,
    lineHeight: 32,
  },
  headerStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.purple["100"],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statPillText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceCard,
    alignItems: "center",
    justifyContent: "center",
  },
  resultsContainer: {
    paddingHorizontal: 24,
    gap: 24,
  },
  resultCard: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resultQuestionNumber: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.light.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  totalVotesBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.purple["100"],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  totalVotesText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  resultQuestion: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 24,
    lineHeight: 26,
  },
  barsContainer: {
    gap: 16,
  },
  barContainer: {
    gap: 8,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  barLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.light.text,
  },
  barValue: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
  barTrack: {
    height: 12,
    backgroundColor: Colors.light.surface,
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 6,
  },
  barPercentage: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.light.primary,
    alignSelf: "flex-end",
  },
  footer: {
    padding: 24,
  },
  footerCard: {
    backgroundColor: Colors.light.purple["100"],
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.text,
    textAlign: "center",
    lineHeight: 20,
  },
});
