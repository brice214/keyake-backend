import { Users } from "lucide-react-native";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useSuperAdmin } from "@/contexts/SuperAdminContext";
import { UserProfile } from "@/types";

export default function ParticipantsManagementScreen() {
  const insets = useSafeAreaInsets();
  const { participants } = useSuperAdmin();

  const renderParticipantItem = ({ item }: { item: UserProfile }) => (
    <View style={styles.participantCard}>
      <View style={styles.participantHeader}>
        <View style={styles.participantIcon}>
          <Users size={24} color={Colors.light.primary} />
        </View>
        <View style={styles.participantInfo}>
          <Text style={styles.participantName}>{item.name}</Text>
          <Text style={styles.participantEmail}>{item.email}</Text>
        </View>
      </View>

      <View style={styles.participantStats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{item.surveysCompleted}</Text>
          <Text style={styles.statLabel}>Sondages</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{item.points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des Participants</Text>
        <Text style={styles.subtitle}>{participants.length} participant(s)</Text>
      </View>

      <FlatList
        data={participants}
        renderItem={renderParticipantItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Users size={48} color={Colors.light.textTertiary} />
            <Text style={styles.emptyStateText}>Aucun participant</Text>
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
  participantCard: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  participantHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  participantIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.purple["100"],
    alignItems: "center",
    justifyContent: "center",
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  participantEmail: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  participantStats: {
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
