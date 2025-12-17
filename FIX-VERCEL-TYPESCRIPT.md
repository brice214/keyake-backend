# Fix: Erreurs TypeScript avec alias @/ sur Vercel

## 🔍 Problème

Vercel ne peut pas résoudre les imports avec l'alias `@/` lors du build TypeScript :
```
error TS2307: Cannot find module '@/backend/trpc/create-context'
```

## 🔧 Solution

Le problème vient du fait que Vercel utilise TypeScript pour vérifier le code mais les alias de chemins ne sont pas résolus correctement.

### Option 1 : Utiliser des imports relatifs dans api/index.ts (Solution simple)

Au lieu d'utiliser les alias `@/`, utilisons des imports relatifs dans le fichier `api/index.ts` puisque c'est le point d'entrée pour Vercel.

### Option 2 : Configurer un tsconfig spécifique pour Vercel

Créer un `tsconfig.json` qui fonctionne mieux avec Vercel.

### Option 3 : Utiliser un bundler comme esbuild ou swc

Configurer Vercel pour utiliser un bundler qui résout mieux les alias.

## ✅ Solution recommandée : Modifier api/index.ts pour utiliser des imports relatifs

Modifions `api/index.ts` pour ne pas dépendre des alias `@/`.

