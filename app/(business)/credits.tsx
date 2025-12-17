import { Check, CreditCard, Smartphone } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useBusiness } from "@/contexts/BusinessContext";
import { PaymentMethod } from "@/types";

export default function CreditsScreen() {
  const insets = useSafeAreaInsets();
  const { business, creditPackages, purchaseCredits } = useBusiness();

  const [selectedPackage, setSelectedPackage] = useState(creditPackages[1].id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("airtel");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePurchase = async () => {
    if (paymentMethod !== "card" && !phoneNumber.trim()) {
      Alert.alert("Erreur", "Veuillez entrer votre numéro de téléphone");
      return;
    }

    if (paymentMethod !== "card" && phoneNumber.length < 9) {
      Alert.alert("Erreur", "Numéro de téléphone invalide");
      return;
    }

    try {
      await purchaseCredits(selectedPackage, paymentMethod);
      Alert.alert(
        "Succès",
        "Votre achat a été effectué avec succès ! Les crédits ont été ajoutés à votre compte."
      );
      setPhoneNumber("");
    } catch (error) {
      console.error("Purchase error:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de l'achat");
    }
  };

  const paymentMethods: {
    method: PaymentMethod;
    label: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      method: "airtel",
      label: "Airtel Money",
      icon: <Smartphone size={24} color="#E81F2E" />,
      color: "#E81F2E",
    },
    {
      method: "mobicash",
      label: "Mobicash",
      icon: <Smartphone size={24} color="#FF8800" />,
      color: "#FF8800",
    },
    {
      method: "card",
      label: "Carte bancaire",
      icon: <CreditCard size={24} color={Colors.light.primary} />,
      color: Colors.light.primary,
    },
  ];

  const selectedPkg = creditPackages.find((p) => p.id === selectedPackage);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View>
          <Text style={styles.headerTitle}>Acheter des crédits</Text>
          <Text style={styles.headerSubtitle}>
            Solde actuel: {business?.credits || 0} crédits
          </Text>
        </View>
        <View style={styles.creditBadge}>
          <Text style={styles.creditBadgeText}>{business?.credits || 0}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choisissez un pack</Text>
          <View style={styles.packagesGrid}>
            {creditPackages.map((pkg) => (
              <TouchableOpacity
                key={pkg.id}
                style={[
                  styles.packageCard,
                  selectedPackage === pkg.id && styles.packageCardActive,
                  pkg.popular && styles.packageCardPopular,
                ]}
                onPress={() => setSelectedPackage(pkg.id)}
                activeOpacity={0.7}
              >
                {pkg.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>POPULAIRE</Text>
                  </View>
                )}
                <Text style={styles.packageName}>{pkg.name}</Text>
                <View style={styles.packageCredits}>
                  <Text style={styles.packageCreditsNumber}>{pkg.credits}</Text>
                  <Text style={styles.packageCreditsLabel}>crédits</Text>
                </View>
                <Text style={styles.packagePrice}>
                  {pkg.price.toLocaleString()} {pkg.currency}
                </Text>
                <Text style={styles.packageDescription}>{pkg.description}</Text>
                {selectedPackage === pkg.id && (
                  <View style={styles.selectedCheck}>
                    <Check size={20} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Méthode de paiement</Text>
          <View style={styles.paymentMethods}>
            {paymentMethods.map((pm) => (
              <TouchableOpacity
                key={pm.method}
                style={[
                  styles.paymentCard,
                  paymentMethod === pm.method && styles.paymentCardActive,
                ]}
                onPress={() => setPaymentMethod(pm.method)}
                activeOpacity={0.7}
              >
                <View style={[styles.paymentIcon, { backgroundColor: pm.color + "20" }]}>
                  {pm.icon}
                </View>
                <Text style={styles.paymentLabel}>{pm.label}</Text>
                {paymentMethod === pm.method && (
                  <View style={styles.paymentCheck}>
                    <Check size={18} color={Colors.light.primary} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {paymentMethod !== "card" && (
            <View style={styles.phoneInput}>
              <Text style={styles.inputLabel}>Numéro de téléphone</Text>
              <TextInput
                style={styles.textInput}
                placeholder="+224 6XX XX XX XX"
                placeholderTextColor={Colors.light.textTertiary}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
              <Text style={styles.inputHint}>
                Vous recevrez un message de confirmation sur ce numéro
              </Text>
            </View>
          )}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Récapitulatif</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pack:</Text>
            <Text style={styles.summaryValue}>{selectedPkg?.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Crédits:</Text>
            <Text style={styles.summaryValue}>{selectedPkg?.credits}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Paiement:</Text>
            <Text style={styles.summaryValue}>
              {paymentMethods.find((p) => p.method === paymentMethod)?.label}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total:</Text>
            <Text style={styles.summaryTotalValue}>
              {selectedPkg?.price.toLocaleString()} {selectedPkg?.currency}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.purchaseButton}
          onPress={handlePurchase}
          activeOpacity={0.8}
        >
          <Text style={styles.purchaseButtonText}>
            Procéder au paiement
          </Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Informations sur les crédits</Text>
            <Text style={styles.infoText}>
              • 1 sondage public = 10 crédits{"\n"}
              • 1 sondage semi-privé = 5 crédits{"\n"}
              • 1 sondage privé = 2 crédits{"\n"}
              • Les crédits n&apos;expirent jamais
            </Text>
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
  creditBadge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  creditBadgeText: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  packagesGrid: {
    gap: 16,
  },
  packageCard: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.light.border,
    position: "relative" as const,
  },
  packageCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.purple["50"],
  },
  packageCardPopular: {
    borderColor: Colors.light.warning,
  },
  popularBadge: {
    position: "absolute" as const,
    top: -12,
    right: 20,
    backgroundColor: Colors.light.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  packageName: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  packageCredits: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 8,
  },
  packageCreditsNumber: {
    fontSize: 40,
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
  packageCreditsLabel: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  packageDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  selectedCheck: {
    position: "absolute" as const,
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentMethods: {
    gap: 12,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  paymentCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.purple["50"],
  },
  paymentIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  paymentCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.purple["100"],
    alignItems: "center",
    justifyContent: "center",
  },
  phoneInput: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 8,
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
  inputHint: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 16,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  summaryTotalValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
  purchaseButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  purchaseButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  infoCard: {
    flexDirection: "row",
    gap: 16,
    padding: 20,
    backgroundColor: Colors.light.purple["50"],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.purple["100"],
  },
  infoIcon: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
});
