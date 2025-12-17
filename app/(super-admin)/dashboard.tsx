import { useRouter } from "expo-router";
import { Activity, BarChart3, Building2, DollarSign, LogOut, TrendingUp, Users } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useSuperAdmin } from "@/contexts/SuperAdminContext";

export default function SuperAdminDashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { admin, stats, isLoading, logout } = useSuperAdmin();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/account-type" as never);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Super Admin</Text>
          <Text style={styles.name}>{admin?.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={Colors.light.error} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={styles.statIconContainer}>
              <Building2 size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.statValue}>{stats.totalBusinesses}</Text>
            <Text style={styles.statLabel}>Entreprises</Text>
            <Text style={styles.statSubLabel}>{stats.activeBusinesses} actives</Text>
          </View>

          <View style={[styles.statCard, styles.statCardSuccess]}>
            <View style={styles.statIconContainer}>
              <Users size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.statValue}>{stats.totalParticipants}</Text>
            <Text style={styles.statLabel}>Participants</Text>
          </View>

          <View style={[styles.statCard, styles.statCardInfo]}>
            <View style={styles.statIconContainer}>
              <BarChart3 size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.statValue}>{stats.totalSurveys}</Text>
            <Text style={styles.statLabel}>Sondages</Text>
            <Text style={styles.statSubLabel}>{stats.activeSurveys} actifs</Text>
          </View>

          <View style={[styles.statCard, styles.statCardWarning]}>
            <View style={styles.statIconContainer}>
              <DollarSign size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.statValue}>{stats.totalRevenue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Revenus (GNF)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Activity size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Activité récente</Text>
          </View>

          {stats.recentActivity.length > 0 ? (
            <View style={styles.activityList}>
              {stats.recentActivity.slice(0, 10).map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={styles.activityIconContainer}>
                    {activity.type === "business_signup" && (
                      <Building2 size={16} color={Colors.light.primary} />
                    )}
                    {activity.type === "survey_created" && (
                      <BarChart3 size={16} color={Colors.light.success} />
                    )}
                    {activity.type === "credit_purchase" && (
                      <DollarSign size={16} color={Colors.light.warning} />
                    )}
                    {activity.type === "survey_completed" && (
                      <TrendingUp size={16} color={Colors.light.info} />
                    )}
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                    <Text style={styles.activityTime}>
                      {new Date(activity.timestamp).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Aucune activité récente</Text>
            </View>
          )}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Actions rapides</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(super-admin)/businesses" as never)}
              activeOpacity={0.7}
            >
              <Building2 size={24} color={Colors.light.primary} />
              <Text style={styles.actionLabel}>Gérer entreprises</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(super-admin)/participants" as never)}
              activeOpacity={0.7}
            >
              <Users size={24} color={Colors.light.primary} />
              <Text style={styles.actionLabel}>Gérer participants</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(super-admin)/surveys" as never)}
              activeOpacity={0.7}
            >
              <BarChart3 size={24} color={Colors.light.primary} />
              <Text style={styles.actionLabel}>Voir sondages</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(super-admin)/create" as never)}
              activeOpacity={0.7}
            >
              <TrendingUp size={24} color={Colors.light.primary} />
              <Text style={styles.actionLabel}>Créer sondage</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  greeting: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  name: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: 40,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    minHeight: 140,
  },
  statCardPrimary: {
    backgroundColor: Colors.light.primary,
  },
  statCardSuccess: {
    backgroundColor: Colors.light.success,
  },
  statCardInfo: {
    backgroundColor: Colors.light.info,
  },
  statCardWarning: {
    backgroundColor: Colors.light.warning,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  statSubLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.7,
    marginTop: 2,
  },
  section: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500" as const,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  quickActions: {
    gap: 12,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    width: "48%",
    backgroundColor: Colors.light.surfaceCard,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.text,
    textAlign: "center",
  },
});
