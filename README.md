# Directory App — Backend API

REST API for the Directory App, built with NestJS and MongoDB Atlas.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 10 |
| Language | TypeScript |
| Database | MongoDB Atlas (Mongoose 9) |
| Authentication | JWT (@nestjs/jwt) + Passport.js |
| OAuth | Google, GitHub, Facebook |
| Password hashing | bcryptjs |
| Validation | class-validator + class-transformer |
| Config | @nestjs/config |
| Testing | Jest |

## Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)
- OAuth app credentials (Google, GitHub, Facebook) if using social login

## Installation

```bash
npm install
cp .env.example .env
# Fill in the required environment variables (see below)
```

## Environment Variables

```env
PORT=3000
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>

# JWT
JWT_SECRET=<random-secret-min-32-chars>

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# Facebook OAuth
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback
```

## Running the App

```bash
# Development (watch mode)
npm run start:dev

# Debug mode
npm run start:debug

# Production
npm run build
npm run start:prod
```

Server starts on `http://localhost:3000`.

## Architecture

```
src/
├── auth/                    # Auth module
│   ├── decorators/
│   │   ├── public.decorator.ts    # @Public() — opt-out from JWT guard
│   │   └── user.decorators.ts     # @CurrentUser() — injects auth user
│   ├── guards/
│   │   └── jwt-auth.guard.ts      # Global guard, secure-by-default
│   ├── strategies/
│   │   ├── google.strategy.ts
│   │   ├── github.strategy.ts
│   │   └── facebook.strategy.ts
│   ├── schemas/
│   │   └── user.schema.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── companies/               # Companies resource (CRUD)
├── contacts/                # Contacts resource (CRUD + batch delete)
├── common/
│   └── pipes/
│       └── parse-objectid.pipe.ts # Validates :id params as MongoDB ObjectId
├── app.module.ts
└── main.ts
```

### Key Design Decisions

**Secure by default** — `JwtAuthGuard` is applied globally. Routes that don't require auth are explicitly marked with `@Public()`. This prevents accidentally exposing a protected route.

**DTO validation** — Every incoming payload is validated via class-validator decorators. The global `ValidationPipe` strips unknown fields (`whitelist: true`) and rejects requests with extra properties (`forbidNonWhitelisted: true`).

**`ParseObjectIdPipe`** — Route params are validated as valid MongoDB ObjectIds before reaching the service layer. Prevents malformed IDs from causing unexpected DB errors.

**OAuth upsert** — Social login creates the user on first login and updates their profile on subsequent logins. OAuth users have no password stored; a synthetic email is generated for providers that don't return one (`{provider}_{providerId}@oauth.local`).

## API Endpoints

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /login | Public | Email/password login |
| POST | /signup | Public | Register new user |
| GET | /auth/google | Public | Initiate Google OAuth |
| GET | /auth/google/callback | Public | Google OAuth callback |
| GET | /auth/github | Public | Initiate GitHub OAuth |
| GET | /auth/github/callback | Public | GitHub OAuth callback |
| GET | /auth/facebook | Public | Initiate Facebook OAuth |
| GET | /auth/facebook/callback | Public | Facebook OAuth callback |
| POST | /logout | Public | Logout (client-side token removal) |

OAuth callbacks redirect to `{FRONTEND_URL}/auth/callback?token=<jwt>`.

### Contacts

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /contacts | — | List all contacts (company populated) |
| GET | /contacts/:id | — | Get single contact |
| POST | /contacts | Required | Create contact |
| PATCH | /contacts/:id | Required | Update contact |
| DELETE | /contacts/:id | Required | Delete contact |
| DELETE | /contacts/batch/:ids | Required | Batch delete (comma-separated IDs) |

### Companies

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /companies | — | List all companies |
| GET | /companies/:id | — | Get single company |
| POST | /companies | Required | Create company |
| PATCH | /companies/:id | Required | Update company |
| DELETE | /companies/:id | Required | Delete company |

## Authentication Flow

**Email/Password:**
1. `POST /login` → bcrypt comparison → JWT issued (1h expiry)

**OAuth:**
1. Frontend navigates to `/auth/:provider`
2. Passport redirects to provider
3. Provider redirects to `/auth/:provider/callback`
4. Strategy normalizes user profile
5. AuthService upserts User in MongoDB, issues JWT
6. Backend redirects to `{FRONTEND_URL}/auth/callback?token=<jwt>`
7. Frontend stores token in Redux state

## Testing

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

## Linting

```bash
npm run lint
```
