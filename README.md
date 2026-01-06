# Directory API - Backend

Backend API pour l'application Directory App, construit avec NestJS, Supabase, et déployé sur Vercel.

## 🚀 Technologies

- **NestJS** - Framework Node.js
- **Supabase** - Base de données PostgreSQL
- **Vercel** - Déploiement
- **TypeScript** - Langage de programmation

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase
- Compte Vercel (pour le déploiement)

## 🛠️ Installation

1. Installer les dépendances :
```bash
npm install
```

2. Créer un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

3. Configurer les variables d'environnement dans `.env` :
   - `SUPABASE_URL` : URL de votre projet Supabase
   - `SUPABASE_ANON_KEY` : Clé anonyme de votre projet Supabase
   - `FRONTEND_URL` : URL de votre frontend (pour CORS)

## 🗄️ Configuration Supabase

### 1. Créer les tables

Exécutez le script SQL suivant dans l'éditeur SQL de Supabase :

```sql
-- Voir le fichier supabase-schema.sql
```

### 2. Configurer les RLS (Row Level Security)

Les politiques RLS doivent être configurées selon vos besoins de sécurité.

## 🏃 Développement

```bash
# Démarrer en mode développement
npm run start:dev

# Le serveur sera accessible sur http://localhost:3000
```

## 📦 Build

```bash
# Build pour la production
npm run build

# Démarrer en mode production
npm run start:prod
```

## 🚢 Déploiement sur Vercel

1. Installer Vercel CLI :
```bash
npm i -g vercel
```

2. Se connecter à Vercel :
```bash
vercel login
```

3. Déployer :
```bash
vercel
```

4. Configurer les variables d'environnement dans le dashboard Vercel :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `FRONTEND_URL`

## 📚 Endpoints API

### Contacts
- `GET /contacts` - Liste tous les contacts
- `GET /contacts/:id` - Détails d'un contact
- `POST /contacts` - Créer un contact
- `PATCH /contacts/:id` - Mettre à jour un contact
- `DELETE /contacts/:id` - Supprimer un contact
- `DELETE /contacts/batch/:ids` - Supprimer plusieurs contacts (ids séparés par virgule)

### Companies
- `GET /companies` - Liste toutes les entreprises
- `GET /companies/:id` - Détails d'une entreprise
- `POST /companies` - Créer une entreprise
- `PATCH /companies/:id` - Mettre à jour une entreprise
- `DELETE /companies/:id` - Supprimer une entreprise

### Auth
- `POST /login` - Connexion
- `POST /logout` - Déconnexion

## 🔒 Sécurité

- Les variables d'environnement sensibles ne doivent jamais être commitées
- Utilisez les politiques RLS de Supabase pour sécuriser l'accès aux données
- Configurez CORS correctement pour votre frontend

## 📝 Notes

- Le backend utilise Supabase comme base de données
- Les relations entre tables sont gérées via les foreign keys
- Les timestamps sont automatiquement gérés par Supabase

