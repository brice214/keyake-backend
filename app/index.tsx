import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

export default function IndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const checkAuthState = useCallback(async () => {
    try {
      const isAuthenticated = await AsyncStorage.getItem("user_authenticated");
      const userType = await AsyncStorage.getItem("user_type");
      const hasSeenWelcome = await AsyncStorage.getItem("has_seen_welcome");

      if (isAuthenticated === "true") {
        if (userType === "business") {
          router.replace("/(business)/dashboard" as never);
        } else {
          router.replace("/(tabs)/home" as never);
        }
      } else if (hasSeenWelcome === "true") {
        router.replace("/account-type" as never);
      } else {
        await AsyncStorage.setItem("has_seen_welcome", "true");
        router.replace("/welcome" as never);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      router.replace("/welcome" as never);
    }
  }, [router]);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ActivityIndicator size="large" color={Colors.light.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },
});
