import { useRouter } from "expo-router";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  Clock,
  Eye,
  LogOut,
  TrendingUp,
  Users,
} from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useBusiness } from "@/contexts/BusinessContext";

export default function BusinessDashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { business, surveys, transactions, logout } = useBusiness();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/account-type" as never);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!business) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const activeSurveys = surveys.filter((s) => s.status === "active");
  const recentTransactions = transactions.slice(0, 3);

  const stats = [
    {
      label: "Sondages actifs",
      value: activeSurveys.length.toString(),
      icon: BarChart3,
      color: Colors.light.primary,
    },
    {
      label: "Total réponses",
      value: business.totalResponses.toString(),
      icon: Users,
      color: Colors.light.success,
    },
    {
      label: "Crédits restants",
      value: business.credits.toString(),
      icon: TrendingUp,
      color: Colors.light.warning,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bienvenue</Text>
            <Text style={styles.companyName}>{business.companyName}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.companyBadge} activeOpacity={0.7}>
              <Building2 size={24} color={Colors.light.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutIconButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <LogOut size={20} color={Colors.light.error} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View
                style={[styles.statIconContainer, { backgroundColor: `${stat.color}20` }]}
              >
                <stat.icon size={20} color={stat.color} strokeWidth={2} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sondages récents</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {activeSurveys.length === 0 ? (
            <View style={styles.emptyCard}>
              <BarChart3 size={48} color={Colors.light.textTertiary} strokeWidth={1.5} />
              <Text style={styles.emptyText}>Aucun sondage actif</Text>
              <Text style={styles.emptySubtext}>
                Créez votre premier sondage pour commencer
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => router.push("/(business)/create" as never)}
                activeOpacity={0.8}
              >
                <Text style={styles.createButtonText}>Créer un sondage</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.surveysList}>
              {activeSurveys.slice(0, 3).map((survey) => (
                <TouchableOpacity
                  key={survey.id}
                  style={styles.surveyCard}
                  activeOpacity={0.7}
                >
                  <View style={styles.surveyHeader}>
                    <View style={styles.surveyCategory}>
                      <Text style={styles.surveyCategoryText}>{survey.category}</Text>
                    </View>
                    <View style={styles.surveyStatus}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>Actif</Text>
                    </View>
                  </View>
                  <Text style={styles.surveyTitle} numberOfLines={2}>
                    {survey.title}
                  </Text>
                  <View style={styles.surveyFooter}>
                    <View style={styles.surveyMeta}>
                      <Users size={14} color={Colors.light.textSecondary} />
                      <Text style={styles.surveyMetaText}>
                        {survey.participantCount} réponses
                      </Text>
                    </View>
                    <ArrowUpRight size={16} color={Colors.light.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activité récente</Text>
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyActivityCard}>
              <Clock size={32} color={Colors.light.textTertiary} />
              <Text style={styles.emptyActivityText}>Aucune activité récente</Text>
            </View>
          ) : (
            <View style={styles.activityList}>
              {recentTransactions.map((transaction) => (
                <View key={transaction.id} style={styles.activityItem}>
                  <View
                    style={[
                      styles.activityIcon,
                      { backgroundColor: Colors.light.success + "20" },
                    ]}
                  >
                    <TrendingUp size={16} color={Colors.light.success} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>
                      Achat de {transaction.credits} crédits
                    </Text>
                    <Text style={styles.activityDate}>
                      {new Date(transaction.createdAt).toLocaleDateString("fr-FR")}
                    </Text>
                  </View>
                  <Text style={styles.activityAmount}>
                    {transaction.amount.toLocaleString()} GNF
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Actions rapides</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(business)/create" as never)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: Colors.light.primary + "20" },
                ]}
              >
                <BarChart3 size={24} color={Colors.light.primary} />
              </View>
              <Text style={styles.actionText}>Nouveau sondage</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(business)/surveys" as never)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.actionIcon, { backgroundColor: Colors.light.primary + "20" }]}
              >
                <Eye size={24} color={Colors.light.primary} />
              </View>
              <Text style={styles.actionText}>Voir les résultats</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(business)/credits" as never)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: Colors.light.warning + "20" },
                ]}
              >
                <TrendingUp size={24} color={Colors.light.warning} />
              </View>
              <Text style={styles.actionText}>Acheter crédits</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  companyBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.light.purple["100"],
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIconButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.light.surfaceCard,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.light.error + "30",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  emptyCard: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  surveysList: {
    gap: 12,
  },
  surveyCard: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    padding: 16,
  },
  surveyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
  surveyStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.success,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.success,
  },
  surveyTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  surveyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  surveyMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  surveyMetaText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  emptyActivityCard: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  emptyActivityText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 12,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  quickActions: {
    marginBottom: 32,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.text,
    textAlign: "center",
  },
});
