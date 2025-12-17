import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import Constants from "expo-constants";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  // Note: Le backend tRPC Rork est actuellement instable (bêta)
  // Selon le support Rork, il est recommandé d'utiliser Supabase/Firebase
  // Cette URL est désactivée pour éviter les crashes
  
  // Si vous avez besoin d'utiliser un backend, configurez-le ici
  // ou utilisez Supabase/Firebase comme recommandé par Rork
  
  // Pour l'instant, retournons une URL factice qui ne sera pas utilisée
  // car les appels tRPC seront gérés avec retry et gestion d'erreur
  const defaultUrl = "https://localhost:3000";
  
  // Variable d'environnement (si configurée pour un backend personnalisé)
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  
  // Vérifier dans expo-constants (pour les builds)
  if (Constants.expoConfig?.extra?.API_BASE_URL) {
    return Constants.expoConfig.extra.API_BASE_URL;
  }
  
  return defaultUrl;
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      // Note: Les erreurs de connexion seront gérées au niveau des queries
      // avec retry: false pour éviter les tentatives infinies
    }),
  ],
});
