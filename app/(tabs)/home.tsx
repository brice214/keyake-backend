import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { TrendingUp } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useTrendingSurveys } from "@/contexts/AppContext";
import { Category, Survey } from "@/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48;

const categories: { name: Category; emoji: string }[] = [
  { name: "Société", emoji: "👥" },
  { name: "Politique", emoji: "🏛️" },
  { name: "Divertissement", emoji: "🎭" },
  { name: "Business", emoji: "💼" },
  { name: "Sport", emoji: "⚽" },
  { name: "Santé", emoji: "🏥" },
  { name: "Technologie", emoji: "💻" },
  { name: "Éducation", emoji: "📚" },
];

const SurveyCard = ({ survey }: { survey: Survey }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/survey/${survey.id}` as never);
  };

  return (
    <TouchableOpacity
      style={styles.surveyCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {survey.imageUrl && (
        <Image source={{ uri: survey.imageUrl }} style={styles.surveyImage} contentFit="cover" />
      )}
      <View style={styles.surveyContent}>
        <View style={styles.surveyHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{survey.category}</Text>
          </View>
          <View style={styles.creatorBadge}>
            <Text style={styles.creatorText}>
              {survey.creatorType === "admin" ? "KéyaKé" : "Entreprise"}
            </Text>
          </View>
        </View>
        <Text style={styles.surveyTitle} numberOfLines={2}>
          {survey.title}
        </Text>
        <Text style={styles.surveyDescription} numberOfLines={2}>
          {survey.description}
        </Text>
        <View style={styles.surveyFooter}>
          <Text style={styles.participantCount}>
            {survey.participantCount.toLocaleString()} participants
          </Text>
          <Text style={styles.questionCount}>
            {survey.questions.length} {survey.questions.length === 1 ? "question" : "questions"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CategoryChip = ({ category, emoji }: { category: Category; emoji: string }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.categoryChip}
      onPress={() => router.push(`/explore?category=${category}` as never)}
      activeOpacity={0.7}
    >
      <Text style={styles.categoryEmoji}>{emoji}</Text>
      <Text style={styles.categoryName}>{category}</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const trendingSurveys = useTrendingSurveys();

  return (
    <View style={[styles.container, { backgroundColor: Colors.light.surface }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>KéyaKé</Text>
          <Text style={styles.tagline}>La voix du peuple</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp color={Colors.light.primary} size={24} />
            <Text style={styles.sectionTitle}>Tendances</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingScroll}
          >
            {trendingSurveys.map((survey) => (
              <SurveyCard key={survey.id} survey={survey} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catégories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat) => (
              <CategoryChip key={cat.name} category={cat.name} emoji={cat.emoji} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  logo: {
    fontSize: 36,
    fontWeight: "700" as const,
    color: Colors.light.primary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
    fontWeight: "500" as const,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  trendingScroll: {
    paddingRight: 24,
    gap: 16,
  },
  surveyCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  surveyImage: {
    width: "100%",
    height: 180,
    backgroundColor: Colors.light.purple[100],
  },
  surveyContent: {
    padding: 20,
  },
  surveyHeader: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: Colors.light.purple[100],
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
  surveyTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 26,
  },
  surveyDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  surveyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participantCount: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  questionCount: {
    fontSize: 13,
    color: Colors.light.textTertiary,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.surfaceCard,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
});
