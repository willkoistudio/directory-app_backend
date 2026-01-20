# OAuth Configuration Guide

This guide explains how to configure OAuth authentication for Google, GitHub, and Facebook.

## Prerequisites

You need to create OAuth applications for each provider you want to support.

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the consent screen
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/auth/google/callback`
   - Production: `https://yourdomain.com/auth/google/callback`
7. Copy the Client ID and Client Secret
8. Update your `.env` file:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: Your app name
   - Homepage URL: `http://localhost:5173` (or your frontend URL)
   - Authorization callback URL: `http://localhost:3000/auth/github/callback`
4. Click "Register application"
5. Copy the Client ID
6. Generate a new client secret and copy it
7. Update your `.env` file:
   ```
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

## Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add "Facebook Login" product
4. Configure "Facebook Login" settings:
   - Valid OAuth Redirect URIs: `http://localhost:3000/auth/facebook/callback`
5. Go to Settings → Basic
6. Copy the App ID and App Secret
7. Update your `.env` file:
   ```
   FACEBOOK_APP_ID=your-facebook-app-id
   FACEBOOK_APP_SECRET=your-facebook-app-secret
   ```

## Environment Variables

Your `.env` file should contain:

```env
# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback
```

## Testing OAuth

1. Make sure your backend is running on `http://localhost:3000`
2. Make sure your frontend is running on `http://localhost:5173`
3. Click on one of the OAuth buttons (Google, GitHub, or Facebook) on the login/signup page
4. You will be redirected to the provider's authentication page
5. After successful authentication, you will be redirected back to your app with a token
6. The app will automatically log you in

## Production Deployment

For production:

1. Update all callback URLs to use your production domain (HTTPS required)
2. Update the `.env` file with production OAuth credentials
3. Make sure to use environment variables, never commit secrets to git
4. Add your production domain to the authorized domains/redirect URIs in each OAuth provider's settings

## Security Notes

- Never commit your `.env` file to version control
- Use different OAuth apps for development and production
- Rotate your OAuth secrets regularly
- Always use HTTPS in production
- Validate redirect URLs to prevent open redirect vulnerabilities
