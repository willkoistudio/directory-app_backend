# 🚀 Guide de Démarrage Rapide

## Étape 1 : Installation

```bash
cd back-end
npm install
```

## Étape 2 : Configuration Supabase

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Dans **SQL Editor**, exécutez le contenu de `supabase-schema.sql`
4. Dans **Settings > API**, copiez :
   - Project URL
   - anon public key

## Étape 3 : Configuration locale

Créez un fichier `.env` :

```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

## Étape 4 : Démarrer le serveur

```bash
npm run start:dev
```

Le serveur sera accessible sur `http://localhost:3000`

## Étape 5 : Tester

```bash
# Tester GET /companies
curl http://localhost:3000/companies

# Tester GET /contacts
curl http://localhost:3000/contacts
```

## Étape 6 : Configurer le Frontend

Dans votre frontend, créez un fichier `.env` :

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_REACT_APP_MOCKED=false
```

Redémarrez votre serveur frontend.

## ✅ C'est prêt !

Votre backend est maintenant opérationnel. Consultez `DEPLOYMENT.md` pour déployer sur Vercel.

