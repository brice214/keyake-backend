import { useRouter } from "expo-router";
import { Award, Calendar, LogOut, Target, TrendingUp } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  value: string | number;
  color: string;
}) => {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color + "20" }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

const BadgeItem = ({ name, date }: { name: string; date: Date }) => {
  return (
    <View style={styles.badgeItem}>
      <View style={styles.badgeIcon}>
        <Text style={styles.badgeEmoji}>🏆</Text>
      </View>
      <View style={styles.badgeInfo}>
        <Text style={styles.badgeName}>{name}</Text>
        <Text style={styles.badgeDate}>
          Obtenu le {date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
        </Text>
      </View>
    </View>
  );
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useApp();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/account-type" as never);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const memberSince = user.joinedAt.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

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
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.status}>{user.status}</Text>
          <View style={styles.memberSinceBadge}>
            <Calendar size={14} color={Colors.light.textSecondary} />
            <Text style={styles.memberSinceText}>Membre depuis {memberSince}</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <StatCard
              icon={Target}
              label="Sondages complétés"
              value={user.surveysCompleted}
              color={Colors.light.primary}
            />
            <StatCard
              icon={TrendingUp}
              label="Points Kéya"
              value={user.points.toLocaleString()}
              color={Colors.light.accent}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award color={Colors.light.primary} size={22} />
            <Text style={styles.sectionTitle}>Badges</Text>
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>{user.badges.length}</Text>
            </View>
          </View>

          {user.badges.length > 0 ? (
            <View style={styles.badgesList}>
              {user.badges.map((badge) => (
                <BadgeItem key={badge.id} name={badge.name} date={badge.earnedAt} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Aucun badge pour le moment</Text>
              <Text style={styles.emptyStateSubtext}>
                Complétez plus de sondages pour débloquer des badges !
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Comment gagner des points ?</Text>
            <Text style={styles.infoText}>
              • Complétez un sondage : +50 points{"\n"}
              • Partagez votre opinion régulièrement{"\n"}
              • Débloquez des badges spéciaux
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={Colors.light.error} />
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
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
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  name: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 12,
    fontWeight: "500" as const,
  },
  memberSinceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.surfaceCard,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  memberSinceText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: "center",
    fontWeight: "500" as const,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  badgeCount: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeCountText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  badgesList: {
    gap: 12,
  },
  badgeItem: {
    flexDirection: "row",
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.purple["100"],
    alignItems: "center",
    justifyContent: "center",
  },
  badgeEmoji: {
    fontSize: 28,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  badgeDate: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  emptyState: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  infoSection: {
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: Colors.light.purple["100"],
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.light.primary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 22,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.surfaceCard,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.light.error + "30",
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.error,
  },
});
