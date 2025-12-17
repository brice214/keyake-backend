# Fix: Résoudre les erreurs d'import alias @/ sur Vercel

## Problème

Vercel ne résout pas les alias `@/` lors de la compilation TypeScript. Tous les fichiers dans `backend/trpc/routes/` utilisent des imports comme :
```typescript
import { publicProcedure } from '@/backend/trpc/create-context';
import { db } from '@/backend/db';
```

## Solutions possibles

### Solution 1 : Créer un script pour remplacer tous les imports (Recommandé)

Créer un script qui remplace automatiquement tous les `@/backend/` par `../../` dans les fichiers de routes.

### Solution 2 : Configurer tsconfig pour Vercel (Plus complexe)

Créer un tsconfig spécifique qui fonctionne avec Vercel et les alias.

### Solution 3 : Désactiver la vérification TypeScript stricte (Solution rapide)

Vercel vérifie TypeScript mais peut continuer même avec des erreurs. Le code fonctionnera à l'exécution car Node.js ne vérifie pas les imports au runtime.

## ✅ Solution rapide : Utiliser un plugin Vercel ou ignorer les erreurs

Vercel continue généralement le build même avec des erreurs TypeScript. Le problème est que le build échoue complètement.

Une autre option est d'utiliser un bundler qui résout les alias avant TypeScript.

