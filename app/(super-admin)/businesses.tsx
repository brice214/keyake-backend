import { Building2, Coins, Pencil, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useSuperAdmin } from "@/contexts/SuperAdminContext";
import { BusinessProfile } from "@/types";

export default function BusinessesManagementScreen() {
  const insets = useSafeAreaInsets();
  const { businesses, updateBusiness, deleteBusiness, adjustBusinessCredits } = useSuperAdmin();
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessProfile | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreditModalVisible, setIsCreditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    companyName: "",
    email: "",
    credits: 0,
  });
  const [creditAmount, setCreditAmount] = useState("");

  const handleEditBusiness = (business: BusinessProfile) => {
    setSelectedBusiness(business);
    setEditForm({
      companyName: business.companyName,
      email: business.email,
      credits: business.credits,
    });
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedBusiness) return;

    try {
      await updateBusiness(selectedBusiness.id, {
        companyName: editForm.companyName,
        email: editForm.email,
        credits: editForm.credits,
      });
      setIsEditModalVisible(false);
      Alert.alert("Succès", "Entreprise mise à jour avec succès");
    } catch {
      Alert.alert("Erreur", "Impossible de mettre à jour l'entreprise");
    }
  };

  const handleDeleteBusiness = (business: BusinessProfile) => {
    Alert.alert(
      "Confirmer la suppression",
      `Êtes-vous sûr de vouloir supprimer ${business.companyName} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBusiness(business.id);
              Alert.alert("Succès", "Entreprise supprimée");
            } catch {
              Alert.alert("Erreur", "Impossible de supprimer l'entreprise");
            }
          },
        },
      ]
    );
  };

  const handleAdjustCredits = (business: BusinessProfile) => {
    setSelectedBusiness(business);
    setCreditAmount("");
    setIsCreditModalVisible(true);
  };

  const handleSaveCredits = async () => {
    if (!selectedBusiness || !creditAmount) return;

    const amount = parseInt(creditAmount, 10);
    if (isNaN(amount)) {
      Alert.alert("Erreur", "Montant invalide");
      return;
    }

    try {
      await adjustBusinessCredits(selectedBusiness.id, amount);
      setIsCreditModalVisible(false);
      Alert.alert("Succès", "Crédits ajustés avec succès");
    } catch {
      Alert.alert("Erreur", "Impossible d&apos;ajuster les crédits");
    }
  };

  const renderBusinessItem = ({ item }: { item: BusinessProfile }) => (
    <View style={styles.businessCard}>
      <View style={styles.businessHeader}>
        <View style={styles.businessIcon}>
          <Building2 size={24} color={Colors.light.primary} />
        </View>
        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>{item.companyName}</Text>
          <Text style={styles.businessEmail}>{item.email}</Text>
        </View>
      </View>

      <View style={styles.businessStats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{item.surveysCreated}</Text>
          <Text style={styles.statLabel}>Sondages</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{item.totalResponses}</Text>
          <Text style={styles.statLabel}>Réponses</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{item.credits}</Text>
          <Text style={styles.statLabel}>Crédits</Text>
        </View>
      </View>

      <View style={styles.businessActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditBusiness(item)}
          activeOpacity={0.7}
        >
          <Pencil size={16} color={Colors.light.primary} />
          <Text style={styles.actionButtonText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAdjustCredits(item)}
          activeOpacity={0.7}
        >
          <Coins size={16} color={Colors.light.success} />
          <Text style={styles.actionButtonText}>Crédits</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteBusiness(item)}
          activeOpacity={0.7}
        >
          <Trash2 size={16} color={Colors.light.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des Entreprises</Text>
        <Text style={styles.subtitle}>{businesses.length} entreprise(s)</Text>
      </View>

      <FlatList
        data={businesses}
        renderItem={renderBusinessItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Building2 size={48} color={Colors.light.textTertiary} />
            <Text style={styles.emptyStateText}>Aucune entreprise</Text>
          </View>
        }
      />

      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <Text style={styles.modalTitle}>Modifier l&apos;entreprise</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom de l&apos;entreprise</Text>
              <TextInput
                style={styles.input}
                value={editForm.companyName}
                onChangeText={(text) => setEditForm({ ...editForm, companyName: text })}
                placeholder="Nom de l&apos;entreprise"
                placeholderTextColor={Colors.light.textTertiary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editForm.email}
                onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                placeholder="Email"
                placeholderTextColor={Colors.light.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Crédits</Text>
              <TextInput
                style={styles.input}
                value={editForm.credits.toString()}
                onChangeText={(text) => setEditForm({ ...editForm, credits: parseInt(text) || 0 })}
                placeholder="Crédits"
                placeholderTextColor={Colors.light.textTertiary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
                activeOpacity={0.7}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isCreditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCreditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <Text style={styles.modalTitle}>Ajuster les crédits</Text>
            <Text style={styles.modalSubtitle}>
              Entreprise: {selectedBusiness?.companyName}
            </Text>
            <Text style={styles.modalSubtitle}>
              Crédits actuels: {selectedBusiness?.credits}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Montant (positif pour ajouter, négatif pour retirer)
              </Text>
              <TextInput
                style={styles.input}
                value={creditAmount}
                onChangeText={setCreditAmount}
                placeholder="Ex: 100 ou -50"
                placeholderTextColor={Colors.light.textTertiary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsCreditModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveCredits}
                activeOpacity={0.7}
              >
                <Text style={styles.saveButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  businessCard: {
    backgroundColor: Colors.light.surfaceCard,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  businessHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  businessIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.purple["100"],
    alignItems: "center",
    justifyContent: "center",
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  businessEmail: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  businessStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
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
  businessActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  deleteButton: {
    flex: 0,
    paddingHorizontal: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.light.surfaceCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  input: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.light.surface,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
});
