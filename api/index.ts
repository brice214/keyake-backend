// Point d'entrée pour Vercel Serverless Functions
import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../backend/trpc/app-router.js";
import { createContext } from "../backend/trpc/create-context.js";

const app = new Hono();

app.use("*", cors());

// Route racine d'abord
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

// tRPC endpoint - capturer toutes les routes /trpc* avec toutes les méthodes HTTP
app.use("/trpc*", async (c) => {
  console.log('tRPC request:', c.req.path, c.req.method, 'URL:', c.req.url);
  
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
  return response;
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
export default app;

// Alternative: export explicite pour Vercel (si nécessaire)
// export const handler = app.fetch;
