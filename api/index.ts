// Point d'entrée pour Vercel Serverless Functions
import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../backend/trpc/app-router.js";
import { createContext } from "../backend/trpc/create-context.js";

const app = new Hono();

app.use("*", cors());

// tRPC endpoint - capturer AVANT les autres routes avec un middleware global
app.use("*", async (c, next) => {
  const path = c.req.path;
  const url = c.req.url;
  
  // Log toutes les requêtes pour debug
  console.log('Request received:', { path, url, method: c.req.method });
  
  // Si le chemin commence par /trpc, le traiter comme tRPC
  if (path.startsWith("/trpc")) {
    console.log('✅ tRPC middleware triggered!', { path, url, method: c.req.method });
    
    try {
      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: c.req.raw,
        router: appRouter,
        createContext,
      });
      console.log('tRPC response status:', response.status);
      return response;
    } catch (error) {
      console.error('❌ tRPC error:', error);
      return c.json({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        path,
        url 
      }, 500);
    }
  }
  
  console.log('⚠️ Path does not start with /trpc, passing to next handler');
  await next();
});

// Route racine
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

// Route de test pour vérifier le routage
app.get("/test", (c) => {
  return c.json({ path: c.req.path, url: c.req.url, message: "Test route works" });
});

// Error handler pour capturer les erreurs
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  }, 500);
});

// Export pour Vercel - Hono fonctionne directement avec Vercel Serverless Functions
// Vercel détecte automatiquement l'app Hono et utilise app.fetch
export default app;
