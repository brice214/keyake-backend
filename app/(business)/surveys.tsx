import { Archive, BarChart3, Clock, FileText, Pause, Play, Trash2, Users } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useBusiness } from "@/contexts/BusinessContext";
import { SurveyStatus } from "@/types";

export default function SurveysManagementScreen() {
  const insets = useSafeAreaInsets();
  const { surveys, updateSurvey, deleteSurvey } = useBusiness();

  const [selectedStatus, setSelectedStatus] = useState<SurveyStatus | "all">("all");

  const filteredSurveys =
    selectedStatus === "all"
      ? surveys
      : surveys.filter((s) => s.status === selectedStatus);

  const statusColors: Record<SurveyStatus, string> = {
    draft: Colors.light.textTertiary,
    active: Colors.light.success,
    scheduled: Colors.light.warning,
    ended: Colors.light.textSecondary,
    archived: Colors.light.textTertiary,
  };

  const handleToggleStatus = (surveyId: string, currentStatus: SurveyStatus) => {
    const newStatus: SurveyStatus = currentStatus === "active" ? "ended" : "active";
    updateSurvey(surveyId, { status: newStatus });
  };

  const handleArchive = (surveyId: string) => {
    updateSurvey(surveyId, { status: "archived" });
  };

  const handleDelete = (surveyId: string, title: string) => {
    Alert.alert(
      "Confirmer la suppression",
      `Êtes-vous sûr de vouloir supprimer "${title}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => deleteSurvey(surveyId),
        },
      ]
    );
  };

  const tabs: { status: SurveyStatus | "all"; label: string }[] = [
    { status: "all", label: "Tous" },
    { status: "active", label: "Actifs" },
    { status: "ended", label: "Terminés" },
    { status: "archived", label: "Archivés" },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>Mes sondages</Text>
        <Text style={styles.headerSubtitle}>{surveys.length} sondages au total</Text>
      </View>

      <View style={styles.tabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabsContent}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.status}
                style={[
                  styles.tab,
                  selectedStatus === tab.status && styles.tabActive,
                ]}
                onPress={() => setSelectedStatus(tab.status)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedStatus === tab.status && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredSurveys.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText size={64} color={Colors.light.textTertiary} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>Aucun sondage</Text>
            <Text style={styles.emptySubtitle}>
              {selectedStatus === "all"
                ? "Créez votre premier sondage"
                : `Aucun sondage ${selectedStatus === "active" ? "actif" : selectedStatus === "ended" ? "terminé" : "archivé"}`}
            </Text>
          </View>
        ) : (
          <View style={styles.surveysList}>
            {filteredSurveys.map((survey) => (
              <View key={survey.id} style={styles.surveyCard}>
                <View style={styles.surveyHeader}>
                  <View style={styles.surveyCategory}>
                    <Text style={styles.surveyCategoryText}>{survey.category}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusColors[survey.status] + "20" },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: statusColors[survey.status] },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: statusColors[survey.status] },
                      ]}
                    >
                      {survey.status === "active"
                        ? "Actif"
                        : survey.status === "ended"
                        ? "Terminé"
                        : survey.status === "archived"
                        ? "Archivé"
                        : survey.status === "draft"
                        ? "Brouillon"
                        : "Programmé"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.surveyTitle}>{survey.title}</Text>
                <Text style={styles.surveyDescription} numberOfLines={2}>
                  {survey.description}
                </Text>

                <View style={styles.surveyMeta}>
                  <View style={styles.metaItem}>
                    <Users size={16} color={Colors.light.textSecondary} />
                    <Text style={styles.metaText}>{survey.participantCount} réponses</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={16} color={Colors.light.textSecondary} />
                    <Text style={styles.metaText}>
                      {survey.questions.length} question{survey.questions.length > 1 ? "s" : ""}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <BarChart3 size={16} color={Colors.light.textSecondary} />
                    <Text style={styles.metaText}>{survey.privacy}</Text>
                  </View>
                </View>

                <View style={styles.surveyActions}>
                  {(survey.status === "active" || survey.status === "ended") && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleToggleStatus(survey.id, survey.status)}
                      activeOpacity={0.7}
                    >
                      {survey.status === "active" ? (
                        <Pause size={18} color={Colors.light.warning} />
                      ) : (
                        <Play size={18} color={Colors.light.success} />
                      )}
                      <Text
                        style={[
                          styles.actionButtonText,
                          {
                            color:
                              survey.status === "active"
                                ? Colors.light.warning
                                : Colors.light.success,
                          },
                        ]}
                      >
                        {survey.status === "active" ? "Terminer" : "Réactiver"}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {survey.status !== "archived" && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleArchive(survey.id)}
                      activeOpacity={0.7}
                    >
                      <Archive size={18} color={Colors.light.textSecondary} />
                      <Text style={styles.actionButtonText}>Archiver</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(survey.id, survey.title)}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={18} color={Colors.light.error} />
                    <Text style={[styles.actionButtonText, { color: Colors.light.error }]}>
                      Supprimer
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 20,
    backgroundColor: Colors.light.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  tabs: {
    backgroundColor: Colors.light.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tabsContent: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
  },
  tabActive: {
    backgroundColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  surveysList: {
    gap: 16,
  },
  surveyCard: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  surveyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  surveyCategory: {
    backgroundColor: Colors.light.purple["100"],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  surveyCategoryText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  surveyTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  surveyDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  surveyMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  surveyActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
});
