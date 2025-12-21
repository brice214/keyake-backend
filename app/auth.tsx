import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Mail, Phone, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { trpc } from "@/lib/trpc";

type AuthMode = "login" | "register";
type ContactMethod = "email" | "phone";

export default function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<AuthMode>("login");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("email");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loginMutation = trpc.auth.loginUser.useMutation();
  const signupMutation = trpc.auth.signupUser.useMutation();

  const handleAuth = async () => {
    try {
      if (mode === "register") {
        if (!name.trim()) {
          Alert.alert("Erreur", "Veuillez entrer votre nom");
          return;
        }
        if (password !== confirmPassword) {
          Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
          return;
        }
        if (password.length < 6) {
          Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères");
          return;
        }
      }

      const contact = contactMethod === "email" ? email : phone;
      if (!contact.trim()) {
        Alert.alert("Erreur", `Veuillez entrer votre ${contactMethod === "email" ? "email" : "téléphone"}`);
        return;
      }
      if (!password.trim()) {
        Alert.alert("Erreur", "Veuillez entrer votre mot de passe");
        return;
      }

      if (mode === "login") {
        const result = await loginMutation.mutateAsync({
          email: contact,
          password,
        });

        await AsyncStorage.setItem("user_authenticated", "true");
        await AsyncStorage.setItem("user_type", "participant");
        await AsyncStorage.setItem("user_name", result.user.name);
        await AsyncStorage.setItem("USER_ID", result.user.id);
        await AsyncStorage.setItem("auth_token", result.token);

        router.replace("/(tabs)/home" as never);
      } else {
        const result = await signupMutation.mutateAsync({
          name,
          email: contact,
          password,
          phone: contactMethod === "phone" ? phone : undefined,
        });

        await AsyncStorage.setItem("user_authenticated", "true");
        await AsyncStorage.setItem("user_type", "participant");
        await AsyncStorage.setItem("user_name", result.name);
        await AsyncStorage.setItem("USER_ID", result.id);

        router.replace("/(tabs)/home" as never);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      Alert.alert("Erreur", error.message || "Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const handleSocialAuth = async (provider: string) => {
    try {
      await AsyncStorage.setItem("user_authenticated", "true");
      await AsyncStorage.setItem("user_type", "participant");
      await AsyncStorage.setItem("user_name", `Utilisateur ${provider}`);

      router.replace("/(tabs)/home" as never);
    } catch (error) {
      console.error("Error saving auth state:", error);
      Alert.alert("Erreur", "Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.header}>
            <Text style={styles.logo}>KéyaKé</Text>
            <Text style={styles.subtitle}>
              {mode === "login" ? "Bon retour parmi nous !" : "Rejoignez la communauté"}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, mode === "login" && styles.tabActive]}
                onPress={() => setMode("login")}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, mode === "login" && styles.tabTextActive]}>
                  Connexion
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, mode === "register" && styles.tabActive]}
                onPress={() => setMode("register")}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, mode === "register" && styles.tabTextActive]}>
                  Inscription
                </Text>
              </TouchableOpacity>
            </View>

            {mode === "register" && (
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <User size={20} color={Colors.light.textSecondary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Nom complet"
                  placeholderTextColor={Colors.light.textTertiary}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.methodSwitch}>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  contactMethod === "email" && styles.methodButtonActive,
                ]}
                onPress={() => setContactMethod("email")}
                activeOpacity={0.7}
              >
                <Mail
                  size={18}
                  color={contactMethod === "email" ? "#FFFFFF" : Colors.light.textSecondary}
                />
                <Text
                  style={[
                    styles.methodText,
                    contactMethod === "email" && styles.methodTextActive,
                  ]}
                >
                  Email
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  contactMethod === "phone" && styles.methodButtonActive,
                ]}
                onPress={() => setContactMethod("phone")}
                activeOpacity={0.7}
              >
                <Phone
                  size={18}
                  color={contactMethod === "phone" ? "#FFFFFF" : Colors.light.textSecondary}
                />
                <Text
                  style={[
                    styles.methodText,
                    contactMethod === "phone" && styles.methodTextActive,
                  ]}
                >
                  Téléphone
                </Text>
              </TouchableOpacity>
            </View>

            {contactMethod === "email" ? (
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Mail size={20} color={Colors.light.textSecondary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Adresse email"
                  placeholderTextColor={Colors.light.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Phone size={20} color={Colors.light.textSecondary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Numéro de téléphone"
                  placeholderTextColor={Colors.light.textTertiary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Text style={styles.lockIcon}>🔒</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={Colors.light.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                {showPassword ? (
                  <EyeOff size={20} color={Colors.light.textSecondary} />
                ) : (
                  <Eye size={20} color={Colors.light.textSecondary} />
                )}
              </TouchableOpacity>
            </View>

            {mode === "register" && (
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirmer le mot de passe"
                  placeholderTextColor={Colors.light.textTertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>
            )}

            {mode === "login" && (
              <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.submitButton, (loginMutation.isPending || signupMutation.isPending) && styles.submitButtonDisabled]}
              onPress={handleAuth}
              activeOpacity={0.8}
              disabled={loginMutation.isPending || signupMutation.isPending}
            >
              {loginMutation.isPending || signupMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {mode === "login" ? "Se connecter" : "S'inscrire"}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou continuer avec</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialAuth("Google")}
                activeOpacity={0.7}
              >
                <Text style={styles.socialIcon}>🔍</Text>
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialAuth("Facebook")}
                activeOpacity={0.7}
              >
                <Text style={styles.socialIcon}>📘</Text>
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: "700" as const,
    color: Colors.light.primary,
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  form: {
    gap: 20,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  methodSwitch: {
    flexDirection: "row",
    gap: 12,
  },
  methodButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    gap: 8,
  },
  methodButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  methodText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
  methodTextActive: {
    color: "#FFFFFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  lockIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "600" as const,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    fontSize: 14,
    color: Colors.light.textTertiary,
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  socialIcon: {
    fontSize: 20,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
});
