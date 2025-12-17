import { useRouter } from "expo-router";
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronRight,
  Globe,
  Lock,
  MapPin,
  Minus,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { countries } from "@/constants/locations";
import { useBusiness } from "@/contexts/BusinessContext";
import {
  BusinessSurvey,
  Category,
  Question,
  QuestionType,
  SurveyPrivacy,
  SurveyTargeting,
  TargetAgeRange,
  TargetGender,
} from "@/types";

type Step = "basic" | "questions" | "targeting" | "privacy" | "review";

const categories: Category[] = [
  "Société",
  "Politique",
  "Divertissement",
  "Business",
  "Sport",
  "Santé",
  "Technologie",
  "Éducation",
];

const questionTypes: { type: QuestionType; label: string; icon: string }[] = [
  { type: "single", label: "Choix simple", icon: "⚪" },
  { type: "multiple", label: "Choix multiples", icon: "☑️" },
  { type: "scale", label: "Échelle", icon: "📊" },
  { type: "boolean", label: "Vrai/Faux", icon: "✓✗" },
  { type: "slider", label: "Curseur", icon: "━━◉━━" },
];

export default function CreateSurveyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { business, createSurvey } = useBusiness();

  const [step, setStep] = useState<Step>("basic");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Société");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [privacy, setPrivacy] = useState<SurveyPrivacy>("public");
  const [targeting, setTargeting] = useState<SurveyTargeting>({
    gender: "all",
    ageRange: ["all"],
  });

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("single");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [scaleMin, setScaleMin] = useState(0);
  const [scaleMax, setScaleMax] = useState(10);

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const costCredits = privacy === "public" ? 10 : privacy === "semi-private" ? 5 : 2;

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const saveQuestion = () => {
    if (!questionText.trim()) {
      Alert.alert("Erreur", "Veuillez entrer le texte de la question");
      return;
    }

    if (
      (questionType === "single" || questionType === "multiple") &&
      options.filter((o) => o.trim()).length < 2
    ) {
      Alert.alert("Erreur", "Veuillez entrer au moins 2 options");
      return;
    }

    const newQuestion: Question = {
      id: editingQuestion?.id || `q_${Date.now()}`,
      text: questionText,
      type: questionType,
      required: true,
      ...(questionType === "single" || questionType === "multiple"
        ? { options: options.filter((o) => o.trim()) }
        : {}),
      ...(questionType === "scale" ? { min: scaleMin, max: scaleMax } : {}),
    };

    if (editingQuestion) {
      setQuestions(questions.map((q) => (q.id === editingQuestion.id ? newQuestion : q)));
    } else {
      setQuestions([...questions, newQuestion]);
    }

    resetQuestionForm();
  };

  const resetQuestionForm = () => {
    setEditingQuestion(null);
    setQuestionText("");
    setQuestionType("single");
    setOptions(["", ""]);
    setScaleMin(0);
    setScaleMax(10);
  };

  const editQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionText(question.text);
    setQuestionType(question.type);
    if (question.options) {
      setOptions(question.options);
    }
    if (question.min !== undefined) setScaleMin(question.min);
    if (question.max !== undefined) setScaleMax(question.max);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleCreateSurvey = async () => {
    if (!business) {
      Alert.alert("Erreur", "Profil entreprise introuvable");
      return;
    }

    if (business.credits < costCredits) {
      Alert.alert(
        "Crédits insuffisants",
        "Vous n'avez pas assez de crédits pour publier ce sondage. Veuillez acheter des crédits.",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Acheter", onPress: () => router.push("/(business)/credits" as never) },
        ]
      );
      return;
    }

    try {
      const newSurvey: Omit<BusinessSurvey, "id" | "createdAt" | "businessId"> = {
        title,
        description,
        category,
        creatorType: "business",
        creatorName: business.companyName,
        questions,
        participantCount: 0,
        isPublic: privacy === "public",
        isTrending: false,
        status: "active",
        privacy,
        targeting,
        costCredits,
      };

      await createSurvey(newSurvey);
      
      Alert.alert(
        "Succès",
        "Votre sondage a été créé avec succès !",
        [{ text: "OK", onPress: () => router.push("/(business)/surveys" as never) }]
      );
    } catch (error) {
      console.error("Error creating survey:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de la création du sondage");
    }
  };

  const renderStepIndicator = () => {
    const steps: { key: Step; label: string }[] = [
      { key: "basic", label: "Infos" },
      { key: "questions", label: "Questions" },
      { key: "targeting", label: "Ciblage" },
      { key: "privacy", label: "Confidentialité" },
      { key: "review", label: "Révision" },
    ];

    const currentIndex = steps.findIndex((s) => s.key === step);

    return (
      <View style={styles.stepIndicator}>
        {steps.map((s, index) => (
          <React.Fragment key={s.key}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  index <= currentIndex && styles.stepCircleActive,
                  index < currentIndex && styles.stepCircleCompleted,
                ]}
              >
                {index < currentIndex ? (
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      index <= currentIndex && styles.stepNumberActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[styles.stepLabel, index === currentIndex && styles.stepLabelActive]}
              >
                {s.label}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  index < currentIndex && styles.stepLineCompleted,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const renderBasicInfo = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Informations de base</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Titre du sondage *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Ex: Satisfaction client 2025"
          placeholderTextColor={Colors.light.textTertiary}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Décrivez l'objectif de votre sondage..."
          placeholderTextColor={Colors.light.textTertiary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Catégorie *</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                category === cat && styles.categoryChipActive,
              ]}
              onPress={() => setCategory(cat)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  category === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          (!title.trim() || !description.trim()) && styles.nextButtonDisabled,
        ]}
        onPress={() => setStep("questions")}
        disabled={!title.trim() || !description.trim()}
        activeOpacity={0.8}
      >
        <Text style={styles.nextButtonText}>Continuer</Text>
        <ChevronRight size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderQuestions = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Questions du sondage</Text>
      
      {questions.length > 0 && (
        <View style={styles.questionsList}>
          {questions.map((q, index) => (
            <View key={q.id} style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.questionContent}>
                  <Text style={styles.questionText}>{q.text}</Text>
                  <Text style={styles.questionTypeLabel}>
                    {questionTypes.find((t) => t.type === q.type)?.label}
                  </Text>
                </View>
                <View style={styles.questionActions}>
                  <TouchableOpacity
                    onPress={() => editQuestion(q)}
                    style={styles.iconButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteQuestion(q.id)}
                    style={styles.iconButton}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={18} color={Colors.light.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.questionForm}>
        <Text style={styles.formTitle}>
          {editingQuestion ? "Modifier la question" : "Ajouter une question"}
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type de question</Text>
          <View style={styles.questionTypeGrid}>
            {questionTypes.map((qt) => (
              <TouchableOpacity
                key={qt.type}
                style={[
                  styles.questionTypeChip,
                  questionType === qt.type && styles.questionTypeChipActive,
                ]}
                onPress={() => setQuestionType(qt.type)}
                activeOpacity={0.7}
              >
                <Text style={styles.questionTypeIcon}>{qt.icon}</Text>
                <Text
                  style={[
                    styles.questionTypeText,
                    questionType === qt.type && styles.questionTypeTextActive,
                  ]}
                >
                  {qt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Question *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Votre question..."
            placeholderTextColor={Colors.light.textTertiary}
            value={questionText}
            onChangeText={setQuestionText}
          />
        </View>

        {(questionType === "single" || questionType === "multiple") && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Options</Text>
            {options.map((option, index) => (
              <View key={index} style={styles.optionRow}>
                <TextInput
                  style={[styles.textInput, styles.optionInput]}
                  placeholder={`Option ${index + 1}`}
                  placeholderTextColor={Colors.light.textTertiary}
                  value={option}
                  onChangeText={(val) => updateOption(index, val)}
                />
                {options.length > 2 && (
                  <TouchableOpacity
                    onPress={() => removeOption(index)}
                    style={styles.removeButton}
                    activeOpacity={0.7}
                  >
                    <Minus size={16} color={Colors.light.error} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              style={styles.addOptionButton}
              onPress={addOption}
              activeOpacity={0.7}
            >
              <Plus size={16} color={Colors.light.primary} />
              <Text style={styles.addOptionText}>Ajouter une option</Text>
            </TouchableOpacity>
          </View>
        )}

        {questionType === "scale" && (
          <View style={styles.scaleInputs}>
            <View style={styles.scaleInput}>
              <Text style={styles.label}>Min</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={scaleMin.toString()}
                onChangeText={(val) => setScaleMin(parseInt(val) || 0)}
              />
            </View>
            <View style={styles.scaleInput}>
              <Text style={styles.label}>Max</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={scaleMax.toString()}
                onChangeText={(val) => setScaleMax(parseInt(val) || 10)}
              />
            </View>
          </View>
        )}

        <View style={styles.questionFormActions}>
          {editingQuestion && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={resetQuestionForm}
              activeOpacity={0.7}
            >
              <X size={16} color={Colors.light.textSecondary} />
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.saveQuestionButton, editingQuestion && { flex: 1 }]}
            onPress={saveQuestion}
            activeOpacity={0.8}
          >
            <Text style={styles.saveQuestionText}>
              {editingQuestion ? "Mettre à jour" : "Ajouter"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setStep("basic")}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.nextButton,
            questions.length === 0 && styles.nextButtonDisabled,
          ]}
          onPress={() => setStep("targeting")}
          disabled={questions.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Continuer</Text>
          <ChevronRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTargeting = () => {
    const ageRanges: TargetAgeRange[] = ["18-24", "25-34", "35-44", "45-54", "55+", "all"];
    const genders: { value: TargetGender; label: string; icon: string }[] = [
      { value: "all", label: "Tous", icon: "👥" },
      { value: "male", label: "Hommes", icon: "👨" },
      { value: "female", label: "Femmes", icon: "👩" },
      { value: "other", label: "Autre", icon: "🧑" },
    ];

    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Ciblage démographique</Text>
        <Text style={styles.stepSubtitle}>
          Définissez votre audience cible (optionnel)
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <Users size={16} color={Colors.light.text} /> Genre
          </Text>
          <View style={styles.genderGrid}>
            {genders.map((g) => (
              <TouchableOpacity
                key={g.value}
                style={[
                  styles.genderChip,
                  targeting.gender === g.value && styles.genderChipActive,
                ]}
                onPress={() => setTargeting({ ...targeting, gender: g.value })}
                activeOpacity={0.7}
              >
                <Text style={styles.genderIcon}>{g.icon}</Text>
                <Text
                  style={[
                    styles.genderText,
                    targeting.gender === g.value && styles.genderTextActive,
                  ]}
                >
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <Calendar size={16} color={Colors.light.text} /> Tranche d&apos;âge
          </Text>
          <View style={styles.ageGrid}>
            {ageRanges.map((age) => (
              <TouchableOpacity
                key={age}
                style={[
                  styles.ageChip,
                  targeting.ageRange?.includes(age) && styles.ageChipActive,
                ]}
                onPress={() => {
                  if (age === "all") {
                    setTargeting({ ...targeting, ageRange: ["all"] });
                  } else {
                    const current = targeting.ageRange?.filter((a) => a !== "all") || [];
                    const updated = current.includes(age)
                      ? current.filter((a) => a !== age)
                      : [...current, age];
                    setTargeting({
                      ...targeting,
                      ageRange: updated.length === 0 ? ["all"] : updated,
                    });
                  }
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.ageText,
                    targeting.ageRange?.includes(age) && styles.ageTextActive,
                  ]}
                >
                  {age === "all" ? "Tous" : age}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <MapPin size={16} color={Colors.light.text} /> Localisation (optionnel)
          </Text>
          <Text style={styles.helperText}>
            Optionnel = Tous les pays (tous les participants inscrits sur KéyaKé)
          </Text>

          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => setShowCountryPicker(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.locationButtonText, selectedCountry && styles.locationButtonTextActive]}>
              {selectedCountry || "Sélectionner un pays"}
            </Text>
            <ChevronRight size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          {selectedCountry && (
            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => setShowCityPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.locationButtonText, selectedCity && styles.locationButtonTextActive]}>
                {selectedCity || "Sélectionner une ville"}
              </Text>
              <ChevronRight size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          )}

          {(selectedCountry || selectedCity) && (
            <View style={styles.selectedLocationContainer}>
              <View style={styles.selectedLocationBadge}>
                <MapPin size={14} color={Colors.light.primary} />
                <Text style={styles.selectedLocationText}>
                  {selectedCity ? `${selectedCity}, ${selectedCountry}` : selectedCountry}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCountry(null);
                    setSelectedCity(null);
                    setTargeting({ ...targeting, location: undefined });
                  }}
                  activeOpacity={0.7}
                >
                  <X size={16} color={Colors.light.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre maximum de réponses (optionnel)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Illimité"
            placeholderTextColor={Colors.light.textTertiary}
            keyboardType="numeric"
            value={targeting.maxResponses?.toString() || ""}
            onChangeText={(val) =>
              setTargeting({
                ...targeting,
                maxResponses: val ? parseInt(val) : undefined,
              })
            }
          />
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep("questions")}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setStep("privacy")}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Continuer</Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPrivacy = () => {
    const privacyOptions: {
      value: SurveyPrivacy;
      label: string;
      description: string;
      icon: React.ReactNode;
      credits: number;
    }[] = [
      {
        value: "public",
        label: "Public",
        description: "Visible par tous les utilisateurs de KéyaKé",
        icon: <Globe size={24} color={Colors.light.primary} />,
        credits: 10,
      },
      {
        value: "semi-private",
        label: "Semi-privé",
        description: "Accessible uniquement via un lien",
        icon: <ChevronRight size={24} color={Colors.light.warning} />,
        credits: 5,
      },
      {
        value: "private",
        label: "Privé",
        description: "Uniquement pour votre équipe",
        icon: <Lock size={24} color={Colors.light.textSecondary} />,
        credits: 2,
      },
    ];

    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Confidentialité</Text>
        <Text style={styles.stepSubtitle}>
          Choisissez qui peut voir votre sondage
        </Text>

        <View style={styles.privacyOptions}>
          {privacyOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.privacyCard,
                privacy === option.value && styles.privacyCardActive,
              ]}
              onPress={() => setPrivacy(option.value)}
              activeOpacity={0.7}
            >
              <View style={styles.privacyIcon}>{option.icon}</View>
              <View style={styles.privacyContent}>
                <Text style={styles.privacyLabel}>{option.label}</Text>
                <Text style={styles.privacyDescription}>{option.description}</Text>
              </View>
              <View style={styles.privacyCredits}>
                <Text style={styles.privacyCreditsText}>{option.credits}</Text>
                <Text style={styles.privacyCreditsLabel}>crédits</Text>
              </View>
              {privacy === option.value && (
                <View style={styles.privacyCheck}>
                  <Check size={20} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.creditInfo}>
          <AlertCircle size={20} color={Colors.light.warning} />
          <Text style={styles.creditInfoText}>
            Ce sondage coûtera {costCredits} crédits. Vous avez{" "}
            <Text style={styles.creditInfoBold}>{business?.credits || 0} crédits</Text>{" "}
            disponibles.
          </Text>
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep("targeting")}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setStep("review")}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Continuer</Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderReview = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Révision finale</Text>
      <Text style={styles.stepSubtitle}>Vérifiez avant de publier</Text>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewSectionTitle}>Informations</Text>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Titre:</Text>
          <Text style={styles.reviewValue}>{title}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Catégorie:</Text>
          <Text style={styles.reviewValue}>{category}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Questions:</Text>
          <Text style={styles.reviewValue}>{questions.length}</Text>
        </View>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewSectionTitle}>Confidentialité</Text>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Type:</Text>
          <Text style={styles.reviewValue}>
            {privacy === "public" ? "Public" : privacy === "semi-private" ? "Semi-privé" : "Privé"}
          </Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Coût:</Text>
          <Text style={[styles.reviewValue, styles.reviewValueBold]}>
            {costCredits} crédits
          </Text>
        </View>
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setStep("privacy")}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.publishButton}
          onPress={handleCreateSurvey}
          activeOpacity={0.8}
        >
          <Text style={styles.publishButtonText}>Publier le sondage</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredCities = selectedCountry
    ? countries
        .find((c) => c.name === selectedCountry)
        ?.cities.filter((city) => city.toLowerCase().includes(citySearch.toLowerCase())) || []
    : [];

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setSelectedCity(null);
    setShowCountryPicker(false);
    setCountrySearch("");
    const location = [country];
    setTargeting({ ...targeting, location });
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCityPicker(false);
    setCitySearch("");
    const location = selectedCountry ? [selectedCountry, city] : [city];
    setTargeting({ ...targeting, location });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <X size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer un sondage</Text>
        <View style={{ width: 24 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === "basic" && renderBasicInfo()}
        {step === "questions" && renderQuestions()}
        {step === "targeting" && renderTargeting()}
        {step === "privacy" && renderPrivacy()}
        {step === "review" && renderReview()}
      </ScrollView>

      {showCountryPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner un pays</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowCountryPicker(false);
                  setCountrySearch("");
                }}
                activeOpacity={0.7}
              >
                <X size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un pays..."
              placeholderTextColor={Colors.light.textTertiary}
              value={countrySearch}
              onChangeText={setCountrySearch}
              autoFocus
            />

            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {filteredCountries.map((country) => (
                <TouchableOpacity
                  key={country.name}
                  style={[
                    styles.modalItem,
                    selectedCountry === country.name && styles.modalItemActive,
                  ]}
                  onPress={() => handleCountrySelect(country.name)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      selectedCountry === country.name && styles.modalItemTextActive,
                    ]}
                  >
                    {country.name}
                  </Text>
                  {selectedCountry === country.name && (
                    <Check size={20} color={Colors.light.primary} strokeWidth={3} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {showCityPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner une ville</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowCityPicker(false);
                  setCitySearch("");
                }}
                activeOpacity={0.7}
              >
                <X size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une ville..."
              placeholderTextColor={Colors.light.textTertiary}
              value={citySearch}
              onChangeText={setCitySearch}
              autoFocus
            />

            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {filteredCities.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.modalItem,
                    selectedCity === city && styles.modalItemActive,
                  ]}
                  onPress={() => handleCitySelect(city)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      selectedCity === city && styles.modalItemTextActive,
                    ]}
                  >
                    {city}
                  </Text>
                  {selectedCity === city && (
                    <Check size={20} color={Colors.light.primary} strokeWidth={3} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.light.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.surfaceCard,
  },
  stepItem: {
    alignItems: "center",
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  stepCircleActive: {
    backgroundColor: Colors.light.primary,
  },
  stepCircleCompleted: {
    backgroundColor: Colors.light.success,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
  stepNumberActive: {
    color: "#FFFFFF",
  },
  stepLabel: {
    fontSize: 11,
    color: Colors.light.textTertiary,
  },
  stepLabelActive: {
    color: Colors.light.primary,
    fontWeight: "600" as const,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.light.border,
    marginHorizontal: 4,
    marginBottom: 26,
  },
  stepLineCompleted: {
    backgroundColor: Colors.light.success,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stepContent: {
    gap: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  stepSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: -16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  textInput: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  textArea: {
    minHeight: 100,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.purple["100"],
    borderColor: Colors.light.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.light.textSecondary,
  },
  categoryChipTextActive: {
    color: Colors.light.primary,
    fontWeight: "600" as const,
  },
  questionsList: {
    gap: 12,
  },
  questionCard: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  questionHeader: {
    flexDirection: "row",
    gap: 12,
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.light.purple["100"],
    alignItems: "center",
    justifyContent: "center",
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
  questionContent: {
    flex: 1,
  },
  questionText: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  questionTypeLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  questionActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 18,
  },
  questionForm: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  questionTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  questionTypeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.light.surfaceCard,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  questionTypeChipActive: {
    backgroundColor: Colors.light.purple["100"],
    borderColor: Colors.light.primary,
  },
  questionTypeIcon: {
    fontSize: 16,
  },
  questionTypeText: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: Colors.light.textSecondary,
  },
  questionTypeTextActive: {
    color: Colors.light.primary,
    fontWeight: "600" as const,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionInput: {
    flex: 1,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.light.error + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  addOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderStyle: "dashed",
    marginTop: 8,
  },
  addOptionText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  scaleInputs: {
    flexDirection: "row",
    gap: 12,
  },
  scaleInput: {
    flex: 1,
    gap: 8,
  },
  questionFormActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
  saveQuestionButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveQuestionText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  genderGrid: {
    flexDirection: "row",
    gap: 12,
  },
  genderChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.light.surfaceCard,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  genderChipActive: {
    backgroundColor: Colors.light.purple["100"],
    borderColor: Colors.light.primary,
  },
  genderIcon: {
    fontSize: 18,
  },
  genderText: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: Colors.light.textSecondary,
  },
  genderTextActive: {
    color: Colors.light.primary,
    fontWeight: "600" as const,
  },
  ageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ageChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceCard,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  ageChipActive: {
    backgroundColor: Colors.light.purple["100"],
    borderColor: Colors.light.primary,
  },
  ageText: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: Colors.light.textSecondary,
  },
  ageTextActive: {
    color: Colors.light.primary,
    fontWeight: "600" as const,
  },
  privacyOptions: {
    gap: 12,
  },
  privacyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.light.surfaceCard,
    borderWidth: 2,
    borderColor: Colors.light.border,
    position: "relative" as const,
  },
  privacyCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.purple["50"],
  },
  privacyIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  privacyContent: {
    flex: 1,
  },
  privacyLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  privacyCredits: {
    alignItems: "flex-end",
  },
  privacyCreditsText: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
  privacyCreditsLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  privacyCheck: {
    position: "absolute" as const,
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  creditInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.warning + "20",
  },
  creditInfoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.text,
    lineHeight: 20,
  },
  creditInfoBold: {
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
  reviewCard: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  reviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  reviewValue: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  reviewValueBold: {
    fontSize: 16,
    color: Colors.light.primary,
  },
  navigationButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
  nextButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.light.textTertiary,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  publishButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.success,
    alignItems: "center",
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  helperText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: -4,
    marginBottom: 8,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  locationButtonText: {
    fontSize: 15,
    color: Colors.light.textTertiary,
  },
  locationButtonTextActive: {
    color: Colors.light.text,
    fontWeight: "500" as const,
  },
  selectedLocationContainer: {
    marginTop: 8,
  },
  selectedLocationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.light.purple["100"],
    borderWidth: 1,
    borderColor: Colors.light.primary,
    alignSelf: "flex-start",
  },
  selectedLocationText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  modalOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  searchInput: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    margin: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalItemActive: {
    backgroundColor: Colors.light.purple["50"],
  },
  modalItemText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  modalItemTextActive: {
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
});
