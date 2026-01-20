# MongoDB Migration Guide

## Overview
This document outlines the migration from Supabase to MongoDB for the Directory App backend.

## What Changed

### 1. Database System
- **Before**: Supabase (PostgreSQL)
- **After**: MongoDB Atlas
- **Connection String**: `mongodb+srv://koiwilliam91_db_user:fj5ADJME3w1Qvtng@cluster0.jl4ntmm.mongodb.net/directory-app?retryWrites=true&w=majority`

### 2. Dependencies Added
```json
{
  "mongodb": "^7.0.0",
  "mongoose": "^9.1.5",
  "@nestjs/mongoose": "^10.1.0",
  "bcryptjs": "^2.4.3",
  "@nestjs/jwt": "^10.2.0",
  "@nestjs/passport": "^10.0.3",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.1",
  "@types/bcryptjs": "^2.4.6",
  "@types/passport-jwt": "^4.0.1"
}
```

### 3. Schema Definitions
Created Mongoose schemas in `src/schemas/`:

#### User Schema (`user.schema.ts`)
```typescript
- email: string (required, unique)
- password: string (required, hashed with bcrypt)
- name: string
- role: string (default: 'user')
- language: string (default: 'en-US')
- timestamps: true (createdAt, updatedAt)
```

#### Company Schema (`company.schema.ts`)
```typescript
- name: string (required)
- phone: string
- fax: string
- website: string
- logo: string
- area: string
- street: string
- cityId: string
- postalCode: string
- countryId: string
- notes: string
- timestamps: true (createdAt, updatedAt)
- Indexes: name
```

#### Contact Schema (`contact.schema.ts`)
```typescript
- name: string (required)
- email: string (required)
- phone: string
- workPhone: string
- fax: string
- function: string
- website: string
- companyId: ObjectId (references Company)
- street: string
- cityId: string
- postalCode: string
- countryId: string
- keywords: string[] (array)
- avatar: string
- notes: string
- timestamps: true (createdAt, updatedAt)
- Indexes: companyId, email
```

### 4. Module Updates

#### App Module (`app.module.ts`)
- Removed: `SupabaseModule`
- Added: `MongooseModule.forRoot(process.env.MONGODB_URI)`

#### Companies Module (`companies/companies.module.ts`)
- Removed: `SupabaseModule` import
- Added: `MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }])`
- Added: `exports: [CompaniesService]`

#### Contacts Module (`contacts/contacts.module.ts`)
- Removed: `SupabaseModule` import
- Added: `MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }])`

#### Auth Module (`auth/auth.module.ts`)
- Removed: `SupabaseModule` import
- Added: `MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])`
- Added: `PassportModule`
- Added: `JwtModule.register()` with JWT configuration
- Added: `exports: [AuthService, JwtModule]`

### 5. Service Updates

#### Companies Service (`companies/companies.service.ts`)
- Removed: `SupabaseService` dependency
- Added: `@InjectModel(Company.name)` with Mongoose Model
- Updated all CRUD operations to use Mongoose methods:
  - `create()`: Uses `new this.companyModel()` and `.save()`
  - `findAll()`: Uses `this.companyModel.find().exec()`
  - `findOne()`: Uses `this.companyModel.findById().exec()`
  - `update()`: Uses `this.companyModel.findByIdAndUpdate()`
  - `remove()`: Uses `this.companyModel.findByIdAndDelete()`
- Updated mapping functions to use MongoDB's `_id` instead of PostgreSQL's `id`

#### Contacts Service (`contacts/contacts.service.ts`)
- Removed: `SupabaseService` dependency
- Added: `@InjectModel(Contact.name)` with Mongoose Model
- Updated all CRUD operations to use Mongoose methods
- Added `.populate('companyId')` for joining company data
- Updated `removeBatch()` to use `deleteMany({ _id: { $in: ids } })`
- Updated mapping functions for MongoDB document structure

#### Auth Service (`auth/auth.service.ts`)
- Removed: `SupabaseService` dependency
- Added: `@InjectModel(User.name)` with Mongoose Model
- Added: `JwtService` for token generation
- **login()**:
  - Uses bcrypt to compare passwords
  - Generates JWT tokens locally
  - Returns user data and session with access_token
- **signup()**:
  - Checks for existing users
  - Hashes passwords with bcrypt (10 salt rounds)
  - Creates new user in MongoDB
  - Returns JWT token
- **getSocialAuthUrl()**:
  - Now throws BadRequestException (OAuth not implemented)
- **logout()**:
  - Simplified (no Supabase cleanup needed)
- Added: `validateUser()` method for JWT guard

### 6. Guard Updates

#### JWT Auth Guard (`auth/guards/jwt-auth.guard.ts`)
- Removed: `SupabaseService` dependency
- Added: `JwtService` for token verification
- Added: `AuthService` for user validation
- Updated token validation:
  - Verifies JWT signature
  - Calls `authService.validateUser()`
  - Attaches user object to request

### 7. Environment Variables

#### Updated `.env` file
```env
# Before
SUPABASE_URL=https://tukgyvmaefzcpfqoezjx.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...

# After
MONGODB_URI=mongodb+srv://koiwilliam91_db_user:fj5ADJME3w1Qvtng@cluster0.jl4ntmm.mongodb.net/directory-app?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 8. Key Differences

#### ID Format
- **Supabase**: UUIDs (e.g., `123e4567-e89b-12d3-a456-426614174000`)
- **MongoDB**: ObjectIds (e.g., `507f1f77bcf86cd799439011`)
- Frontend will need to handle MongoDB ObjectId format

#### Timestamps
- **Supabase**: `created_at`, `updated_at` (snake_case)
- **MongoDB**: `createdAt`, `updatedAt` (camelCase)
- Automatically managed by Mongoose `timestamps: true`

#### Authentication
- **Supabase**: Managed auth with OAuth support
- **MongoDB**: Custom JWT-based auth
  - Passwords hashed with bcrypt
  - JWT tokens with 1-hour expiration
  - **OAuth NOT implemented** (Google, GitHub, Facebook)

#### Relationships
- **Supabase**: Foreign keys with cascading
- **MongoDB**: References using ObjectId
  - Contacts reference Companies via `companyId`
  - Populated using `.populate('companyId')`

## Migration Steps for Frontend

### 1. No Configuration Changes Needed
The frontend doesn't need to change environment variables since it communicates with the backend API, not directly with the database.

### 2. Authentication Differences
- **OAuth removed**: Remove or disable social login buttons (Google, GitHub, Facebook)
- **Email/Password only**: Keep existing email/password login forms
- Token format unchanged: Still Bearer tokens in Authorization header

### 3. Data Structure
- IDs changed from UUID to MongoDB ObjectId format
- Timestamps remain ISO 8601 strings
- All other data structures remain the same

## What to Test

### 1. Authentication
- [x] User signup with email/password
- [x] User login with email/password
- [x] JWT token generation
- [x] Protected route access
- [x] Logout functionality

### 2. Companies
- [ ] Create new company
- [ ] List all companies
- [ ] Get company by ID
- [ ] Update company
- [ ] Delete company

### 3. Contacts
- [ ] Create new contact
- [ ] List all contacts (with company population)
- [ ] Get contact by ID (with company data)
- [ ] Update contact
- [ ] Delete contact
- [ ] Batch delete contacts

### 4. Edge Cases
- [ ] Invalid login credentials
- [ ] Duplicate email signup
- [ ] Invalid JWT token
- [ ] Expired JWT token
- [ ] Missing required fields
- [ ] Invalid MongoDB ObjectIds

## Running the Application

### Start Backend
```bash
cd back-end
npm install
npm run start:dev
```

### Test Authentication
```bash
# Signup
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Security Notes

1. **Change JWT Secret**: The `JWT_SECRET` in `.env` MUST be changed before production
2. **Password Hashing**: Uses bcrypt with 10 salt rounds
3. **Token Expiration**: JWT tokens expire after 1 hour
4. **Connection String**: MongoDB credentials are in `.env` - keep it secret!

## Rollback Plan

If you need to rollback to Supabase:
1. Revert changes to all service files
2. Restore `SupabaseModule` imports
3. Restore `.env` with Supabase credentials
4. Remove Mongoose schemas and MongoDB dependencies
5. Run `npm install` to restore package.json

## Next Steps

1. **Security**: Change `JWT_SECRET` to a strong random string
2. **Testing**: Test all CRUD operations thoroughly
3. **Data Migration**: If you have existing data in Supabase, you'll need to:
   - Export data from Supabase
   - Transform UUIDs to match new ID structure (or keep them if needed)
   - Import into MongoDB
4. **Frontend Updates**: Update any hardcoded ID formats or OAuth flows
5. **Production**: Set up MongoDB Atlas production cluster with proper security

## Troubleshooting

### Connection Issues
- Verify MongoDB Atlas whitelist includes your IP
- Check connection string format
- Ensure database user has proper permissions

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Clear `dist/` folder and rebuild
- Check TypeScript compilation errors

### Authentication Failures
- Verify JWT_SECRET is set in .env
- Check token format (Bearer token)
- Ensure user exists in database

## Support

For MongoDB-specific issues, refer to:
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [NestJS MongoDB Guide](https://docs.nestjs.com/techniques/mongodb)
