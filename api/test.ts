// Test simple pour vérifier si Vercel détecte les fichiers dans api/
export default async function handler(req: Request) {
  return new Response(JSON.stringify({ message: "Test function works!", path: new URL(req.url).pathname }), {
    headers: { "Content-Type": "application/json" },
  });
}

