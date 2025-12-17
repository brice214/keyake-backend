import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Filter } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { Category, Survey } from "@/types";

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

const SurveyItem = ({ survey }: { survey: Survey }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/survey/${survey.id}` as never);
  };

  return (
    <TouchableOpacity
      style={styles.surveyItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {survey.imageUrl && (
        <Image
          source={{ uri: survey.imageUrl }}
          style={styles.surveyThumbnail}
          contentFit="cover"
        />
      )}
      <View style={styles.surveyInfo}>
        <View style={styles.surveyItemHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{survey.category}</Text>
          </View>
          {survey.isTrending && (
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingText}>🔥</Text>
            </View>
          )}
        </View>
        <Text style={styles.surveyItemTitle} numberOfLines={2}>
          {survey.title}
        </Text>
        <Text style={styles.surveyItemDescription} numberOfLines={1}>
          {survey.description}
        </Text>
        <View style={styles.surveyItemFooter}>
          <Text style={styles.participantText}>
            {survey.participantCount.toLocaleString()} votes
          </Text>
          <Text style={styles.questionText}>
            {survey.questions.length} Q
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { category: urlCategory } = useLocalSearchParams<{ category?: string }>();
  const { surveys } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<Category | "Tous">("Tous");

  React.useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory as Category);
    }
  }, [urlCategory]);

  const filteredSurveys = useMemo(() => {
    if (selectedCategory === "Tous") return surveys;
    return surveys.filter((s) => s.category === selectedCategory);
  }, [surveys, selectedCategory]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <Filter color={Colors.light.primary} size={24} />
        <Text style={styles.title}>Explorer</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedCategory === "Tous" && styles.filterChipActive,
          ]}
          onPress={() => setSelectedCategory("Tous")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedCategory === "Tous" && styles.filterChipTextActive,
            ]}
          >
            Tous
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterChip,
              selectedCategory === cat && styles.filterChipActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === cat && styles.filterChipTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.resultCount}>
        {filteredSurveys.length} {filteredSurveys.length === 1 ? "sondage" : "sondages"}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors.light.surface }]}>
      <FlatList
        data={filteredSurveys}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SurveyItem survey={item} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: insets.top + 16, paddingBottom: 24 },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
  },
  headerContainer: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  filterScroll: {
    gap: 12,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceCard,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filterChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  resultCount: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  surveyItem: {
    flexDirection: "row",
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  surveyThumbnail: {
    width: 100,
    height: 120,
    backgroundColor: Colors.light.purple["100"],
  },
  surveyInfo: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  surveyItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: Colors.light.purple["100"],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  trendingBadge: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendingText: {
    fontSize: 12,
  },
  surveyItemTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  surveyItemDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  surveyItemFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  participantText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  questionText: {
    fontSize: 12,
    color: Colors.light.textTertiary,
  },
});
