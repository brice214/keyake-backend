import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Eye, EyeOff, Key, Mail, User } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { router } from 'expo-router';

export default function SetupAdminScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);

  const createAdminMutation = trpc.admin.createSuperAdmin.useMutation();

  const handleCreateAdmin = async () => {
    if (!email || !password || !name || !secretKey) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      const result = await createAdminMutation.mutateAsync({
        email,
        password,
        name,
        secretKey,
      });

      Alert.alert(
        'Succès',
        `Super admin créé avec succès!\n\nEmail: ${result.email}\n\nVous pouvez maintenant vous connecter.`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/account-type' as never),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Échec de la création du super admin');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={StyleSheet.absoluteFillObject}
      />
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Shield size={48} color="#60a5fa" strokeWidth={2} />
              </View>
              <Text style={styles.title}>Configuration Super Admin</Text>
              <Text style={styles.subtitle}>
                Créez le compte super administrateur pour gérer la plateforme
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <User size={20} color="#94a3b8" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Nom complet"
                  placeholderTextColor="#64748b"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Mail size={20} color="#94a3b8" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#64748b"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Key size={20} color="#94a3b8" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Mot de passe (min. 8 caractères)"
                  placeholderTextColor="#64748b"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#94a3b8" />
                  ) : (
                    <Eye size={20} color="#94a3b8" />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Key size={20} color="#94a3b8" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirmer le mot de passe"
                  placeholderTextColor="#64748b"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#94a3b8" />
                  ) : (
                    <Eye size={20} color="#94a3b8" />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <View style={styles.secretKeySection}>
                <Text style={styles.secretKeyLabel}>🔐 Clé secrète d&apos;activation</Text>
                <Text style={styles.secretKeyHint}>
                  Contactez l&apos;administrateur système pour obtenir la clé
                </Text>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Shield size={20} color="#f59e0b" />
                  </View>
                  <TextInput
                    style={[styles.input, styles.secretKeyInput]}
                    placeholder="Clé secrète"
                    placeholderTextColor="#64748b"
                    value={secretKey}
                    onChangeText={setSecretKey}
                    secureTextEntry={!showSecretKey}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowSecretKey(!showSecretKey)}
                  >
                    {showSecretKey ? (
                      <EyeOff size={20} color="#f59e0b" />
                    ) : (
                      <Eye size={20} color="#f59e0b" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.createButton,
                  createAdminMutation.isPending && styles.createButtonDisabled,
                ]}
                onPress={handleCreateAdmin}
                disabled={createAdminMutation.isPending}
              >
                {createAdminMutation.isPending ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Shield size={20} color="#ffffff" />
                    <Text style={styles.createButtonText}>Créer le Super Admin</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
  },
  eyeIcon: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    marginVertical: 24,
  },
  secretKeySection: {
    marginBottom: 24,
  },
  secretKeyLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f59e0b',
    marginBottom: 8,
  },
  secretKeyHint: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 12,
    lineHeight: 18,
  },
  secretKeyInput: {
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  createButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#94a3b8',
    fontSize: 15,
  },
});