import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppProvider } from "@/contexts/AppContext";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { SuperAdminProvider } from "@/contexts/SuperAdminContext";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerBackTitle: "Retour" }}>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="account-type" options={{ headerShown: false }} />
        <Stack.Screen name="setup-admin" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="auth-business" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(business)" options={{ headerShown: false }} />
        <Stack.Screen name="(super-admin)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="survey/[id]" 
          options={{ 
            headerShown: true,
            title: "Sondage",
            headerStyle: {
              backgroundColor: "#FFFFFF",
            },
            headerTintColor: "#8B2FC9",
          }} 
        />
        <Stack.Screen 
          name="results/[id]" 
          options={{ 
            headerShown: true,
            title: "Résultats",
            headerStyle: {
              backgroundColor: "#FFFFFF",
            },
            headerTintColor: "#8B2FC9",
          }} 
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <BusinessProvider>
            <SuperAdminProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <RootLayoutNav />
              </GestureHandlerRootView>
            </SuperAdminProvider>
          </BusinessProvider>
        </AppProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
