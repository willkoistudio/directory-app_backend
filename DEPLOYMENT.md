# Guide de Déploiement - Directory API

Ce guide vous explique comment déployer le backend Directory API sur Vercel avec Supabase comme base de données.

## 📋 Prérequis

1. Compte GitHub
2. Compte Supabase (gratuit disponible)
3. Compte Vercel (gratuit disponible)

## 🗄️ Étape 1 : Configuration Supabase

### 1.1 Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - **Name** : directory-app (ou votre nom)
   - **Database Password** : Choisissez un mot de passe fort
   - **Region** : Choisissez la région la plus proche
5. Cliquez sur "Create new project"

### 1.2 Créer les tables

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Cliquez sur **New Query**
3. Copiez le contenu du fichier `supabase-schema.sql`
4. Collez-le dans l'éditeur
5. Cliquez sur **Run** (ou Ctrl+Enter)

### 1.3 Récupérer les credentials

1. Allez dans **Settings** > **API**
2. Copiez :
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`

## 🚀 Étape 2 : Configuration Vercel

### 2.1 Préparer le projet

1. Assurez-vous que votre code est sur GitHub
2. Vérifiez que le fichier `vercel.json` existe

### 2.2 Déployer sur Vercel

#### Option A : Via le Dashboard Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur **Add New Project**
4. Importez votre repository `directory-api`
5. Configurez :
   - **Framework Preset** : Other
   - **Root Directory** : `directory-api` (si dans un monorepo)
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
6. Ajoutez les variables d'environnement :
   - `SUPABASE_URL` = votre URL Supabase
   - `SUPABASE_ANON_KEY` = votre clé anonyme
   - `FRONTEND_URL` = URL de votre frontend (ex: `https://your-frontend.vercel.app`)
   - `NODE_ENV` = `production`
7. Cliquez sur **Deploy**

#### Option B : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
cd directory-api
vercel

# Ajouter les variables d'environnement
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add FRONTEND_URL
vercel env add NODE_ENV
```

### 2.3 Vérifier le déploiement

1. Vercel vous donnera une URL (ex: `https://directory-api.vercel.app`)
2. Testez l'endpoint : `https://directory-api.vercel.app/companies`
3. Vous devriez recevoir une réponse JSON (probablement un tableau vide)

## 🔧 Étape 3 : Configuration du Frontend

### 3.1 Mettre à jour les services HTTP

Dans votre frontend, mettez à jour les services pour pointer vers votre API :

```typescript
// src/services/contact/contact.service.http.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://your-api.vercel.app',
});

export class ServiceContactHttp implements ServiceContact {
  public async getContacts(): Promise<Contact[]> {
    try {
      const { data } = await apiClient.get<Contact[]>('contacts');
      return data;
    } catch (erreur) {
      throw new Error('Error fetching contacts');
    }
  }
  // ... autres méthodes
}
```

### 3.2 Variables d'environnement Frontend

Créez un fichier `.env` dans votre frontend :

```env
VITE_API_BASE_URL=https://your-api.vercel.app
VITE_REACT_APP_MOCKED=false
```

## 🧪 Étape 4 : Tests

### Tester les endpoints

```bash
# Tester GET /companies
curl https://your-api.vercel.app/companies

# Tester GET /contacts
curl https://your-api.vercel.app/contacts

# Tester POST /companies
curl -X POST https://your-api.vercel.app/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "phone": "1234567890",
    "logo": "https://example.com/logo.png",
    "area": "Technology",
    "address": {
      "street": "123 Main St",
      "cityId": "1",
      "postalCode": "12345",
      "countryId": "1"
    }
  }'
```

## 🔄 Mises à jour

Pour mettre à jour le backend :

1. Faites vos modifications
2. Committez et pushez sur GitHub
3. Vercel redéploiera automatiquement

## 🐛 Dépannage

### Erreur CORS
- Vérifiez que `FRONTEND_URL` est correctement configuré dans Vercel
- Vérifiez que l'URL du frontend correspond exactement

### Erreur de connexion à Supabase
- Vérifiez que `SUPABASE_URL` et `SUPABASE_ANON_KEY` sont corrects
- Vérifiez que les tables existent dans Supabase

### Erreur 404
- Vérifiez que le build s'est bien passé
- Vérifiez que `vercel.json` est correctement configuré

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation NestJS](https://docs.nestjs.com)

