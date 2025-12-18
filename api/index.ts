// Point d'entrée pour Vercel Serverless Functions
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", cors());

// Route racine - version simple qui fonctionne
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

// Export pour Vercel - utiliser app.fetch pour compatibilité avec Vercel
export default {
  fetch: app.fetch,
};
