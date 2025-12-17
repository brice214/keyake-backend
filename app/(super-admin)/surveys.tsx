import { BarChart3 } from "lucide-react-native";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useSuperAdmin } from "@/contexts/SuperAdminContext";
import { BusinessSurvey } from "@/types";

export default function SurveysManagementScreen() {
  const insets = useSafeAreaInsets();
  const { allSurveys } = useSuperAdmin();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return Colors.light.success;
      case "draft":
        return Colors.light.textTertiary;
      case "ended":
        return Colors.light.error;
      default:
        return Colors.light.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "draft":
        return "Brouillon";
      case "ended":
        return "Terminé";
      case "scheduled":
        return "Planifié";
      case "archived":
        return "Archivé";
      default:
        return status;
    }
  };

  const renderSurveyItem = ({ item }: { item: BusinessSurvey }) => (
    <View style={styles.surveyCard}>
      <View style={styles.surveyHeader}>
        <View style={styles.surveyIcon}>
          <BarChart3 size={24} color={Colors.light.primary} />
        </View>
        <View style={styles.surveyInfo}>
          <Text style={styles.surveyTitle}>{item.title}</Text>
          <Text style={styles.surveyDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>

      <View style={styles.surveyMeta}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + "20" }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
        <Text style={styles.surveyCategory}>{item.category}</Text>
      </View>

      <View style={styles.surveyStats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{item.participantCount}</Text>
          <Text style={styles.statLabel}>Participants</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{item.questions.length}</Text>
          <Text style={styles.statLabel}>Questions</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{item.costCredits}</Text>
          <Text style={styles.statLabel}>Crédits</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des Sondages</Text>
        <Text style={styles.subtitle}>{allSurveys.length} sondage(s)</Text>
      </View>

      <FlatList
        data={allSurveys}
        renderItem={renderSurveyItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <BarChart3 size={48} color={Colors.light.textTertiary} />
            <Text style={styles.emptyStateText}>Aucun sondage</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  surveyCard: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  surveyHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  surveyIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.purple["100"],
    alignItems: "center",
    justifyContent: "center",
  },
  surveyInfo: {
    flex: 1,
  },
  surveyTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  surveyDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  surveyMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  surveyCategory: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  surveyStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: Colors.light.border,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
});
