# Solution définitive pour les alias @/ sur Vercel

## 🔍 Problème

Vercel ne résout pas les alias `@/` lors de la vérification TypeScript. Il y a 20 fichiers dans `backend/trpc/routes/` qui utilisent ces alias.

## ✅ Solution recommandée : Utiliser un plugin de résolution

Installer `tsconfig-paths` pour que Vercel puisse résoudre les alias au runtime.

### Option 1 : Installer tsconfig-paths (Recommandé)

```powershell
npm install --save-dev tsconfig-paths
```

Puis créer un fichier `api/index.ts` qui charge tsconfig-paths avant tout :

```typescript
// Charger tsconfig-paths en premier
import 'tsconfig-paths/register';

// Ensuite les autres imports
import { Hono } from "hono";
// ...
```

### Option 2 : Remplacer tous les imports manuellement

Remplacer tous les `@/backend/` par des imports relatifs dans les 20 fichiers.

### Option 3 : Utiliser un bundler personnalisé

Configurer Vercel pour utiliser un bundler qui résout les alias (plus complexe).

## 🚀 Solution rapide : Modifier api/index.ts

Ajoutons `tsconfig-paths/register` au début de `api/index.ts` pour résoudre les alias au runtime.

