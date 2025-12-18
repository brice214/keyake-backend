// Point d'entrée pour Vercel Serverless Functions
import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../backend/trpc/app-router.js";
import { createContext } from "../backend/trpc/create-context.js";

const app = new Hono();

app.use("*", cors());

// tRPC endpoint - utiliser fetchRequestHandler directement
// Sur Vercel, api/index.ts est servi sous /api, donc /trpc/* devient /api/trpc/*
app.all("/trpc/*", async (c) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
  return response;
});

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

// Error handler pour capturer les erreurs
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  }, 500);
});

// Export pour Vercel
export default app;
