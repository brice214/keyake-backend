import { useRouter } from "expo-router";
import { Building2, Users, Shield } from "lucide-react-native";
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

export default function AccountTypeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSelectType = (type: "participant" | "business") => {
    if (type === "participant") {
      router.push("/auth" as never);
    } else {
      router.push("/auth-business" as never);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 24) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>KéyaKé</Text>
          <Text style={styles.title}>Quel type de compte souhaitez-vous créer ?</Text>
          <Text style={styles.subtitle}>
            Choisissez le type de compte qui correspond à vos besoins
          </Text>
        </View>

        <View style={styles.options}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleSelectType("participant")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: Colors.light.purple["100"] }]}>
              <Users size={48} color={Colors.light.primary} strokeWidth={1.5} />
            </View>
            <Text style={styles.optionTitle}>Participant</Text>
            <Text style={styles.optionDescription}>
              Participez aux sondages, gagnez des points et des badges
            </Text>
            <View style={styles.features}>
              <Text style={styles.featureItem}>✓ Répondre aux sondages</Text>
              <Text style={styles.featureItem}>✓ Gagner des récompenses</Text>
              <Text style={styles.featureItem}>✓ Voir les résultats</Text>
            </View>
            <View style={styles.selectButton}>
              <Text style={styles.selectButtonText}>Commencer</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleSelectType("business")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: Colors.light.purple["200"] }]}>
              <Building2 size={48} color={Colors.light.primary} strokeWidth={1.5} />
            </View>
            <Text style={styles.optionTitle}>Entreprise</Text>
            <Text style={styles.optionDescription}>
              Créez des sondages professionnels et analysez les résultats
            </Text>
            <View style={styles.features}>
              <Text style={styles.featureItem}>✓ Créer des sondages</Text>
              <Text style={styles.featureItem}>✓ Analyses avancées</Text>
              <Text style={styles.featureItem}>✓ Exportation de données</Text>
            </View>
            <View style={[styles.selectButton, styles.selectButtonBusiness]}>
              <Text style={styles.selectButtonText}>Commencer</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => router.push('/setup-admin' as never)}
          activeOpacity={0.7}
        >
          <Shield size={16} color={Colors.light.textSecondary} />
          <Text style={styles.adminButtonText}>Configuration Super Admin</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    fontSize: 48,
    fontWeight: "700" as const,
    color: Colors.light.primary,
    letterSpacing: -1,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  options: {
    gap: 20,
  },
  optionCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  features: {
    gap: 8,
    marginBottom: 24,
  },
  featureItem: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  selectButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  selectButtonBusiness: {
    backgroundColor: Colors.light.purple["500"],
  },
  selectButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  adminButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    marginTop: 32,
    borderRadius: 12,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  adminButtonText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: "600" as const,
  },
});
