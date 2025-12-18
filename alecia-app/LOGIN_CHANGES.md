# Login Page Changes

## Summary
The login page has been refactored to use a dropdown selector with user avatars instead of an email input field.

## Changes Made

### 1. Database Scripts
- **reset-user-onboarding.ts**: New script to reset Christophe Berthon's onboarding status
  - Sets `mustChangePassword` to `false`
  - Sets `hasSeenOnboarding` to `false`
  - Run with: `npm run db:reset-onboarding`

- **seed-admin.ts**: Updated to set `hasSeenOnboarding` to `false` by default, making new users go through onboarding

### 2. Login Page UI (`src/app/admin/login/page.tsx`)
- Replaced email input field with a dropdown selector
- Added admin users configuration array with:
  - User ID
  - Display name (first name)
  - Email address
  - Avatar URL (from team page)
- Integrated Avatar component to display user photos in dropdown
- Default user: "Christophe" with avatar from `/assets/Equipe_Alecia/CB_1_-_cropped_-_alt_p800.jpg`

### 3. Authentication Logic
- Modified `handleSubmit` to use the selected user's email from the dropdown
- Password is still entered manually by the user
- Default password for new users: Uses `NEW_USER_PWD` environment variable (default: "password123" from env.example)

## User Experience
1. User opens login page
2. User sees dropdown with "Christophe" selected by default (with avatar)
3. User can select from available admin users in dropdown
4. Each dropdown option shows:
   - User avatar (circular photo)
   - User first name
5. User enters password
6. User clicks "Se connecter" to login

## Admin Users Configuration
Currently configured with one user:
```typescript
const ADMIN_USERS = [
  {
    id: "christophe",
    name: "Christophe",
    email: "christophe.berthon@alecia.fr",
    avatar: "/assets/Equipe_Alecia/CB_1_-_cropped_-_alt_p800.jpg",
  },
];
```

## Adding More Admin Users
To add more admin users to the dropdown, simply add entries to the `ADMIN_USERS` array in `src/app/admin/login/page.tsx`:

```typescript
const ADMIN_USERS = [
  {
    id: "christophe",
    name: "Christophe",
    email: "christophe.berthon@alecia.fr",
    avatar: "/assets/Equipe_Alecia/CB_1_-_cropped_-_alt_p800.jpg",
  },
  {
    id: "john",
    name: "John",
    email: "john@alecia.fr",
    avatar: "/assets/Equipe_Alecia/john_avatar.jpg",
  },
  // Add more users as needed
];
```

## Environment Variables Required
- `NEW_USER_PWD`: Default password for new admin users (see env.example)
- `AUTH_SECRET`: NextAuth secret for session management
- `DATABASE_URL`: PostgreSQL database connection string

## Testing
To test the login page:
1. Ensure database is set up with `npm run db:seed:admin`
2. Start dev server with `npm run dev`
3. Navigate to `/admin/login`
4. Select "Christophe" from dropdown (default)
5. Enter password from `NEW_USER_PWD` environment variable
6. Click "Se connecter"

## Security
- Password authentication still required
- No change to authentication security model
- Only visual change to user selection interface
- All existing NextAuth security features remain intact
