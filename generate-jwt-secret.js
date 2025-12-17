// Script pour générer un JWT_SECRET sécurisé
// Utilisez: node generate-jwt-secret.js

const crypto = require('crypto');

// Générer une clé aléatoire de 32 bytes (256 bits) en base64
const jwtSecret = crypto.randomBytes(32).toString('base64');

console.log('\n🔐 JWT_SECRET généré:');
console.log('═══════════════════════════════════════════════════════════');
console.log(jwtSecret);
console.log('═══════════════════════════════════════════════════════════');
console.log('\n⚠️  IMPORTANT:');
console.log('1. Copiez cette clé et gardez-la secrète');
console.log('2. Ne la partagez JAMAIS publiquement');
console.log('3. Utilisez-la dans Vercel comme variable d\'environnement');
console.log('4. Utilisez la même clé dans votre fichier env local si nécessaire\n');

