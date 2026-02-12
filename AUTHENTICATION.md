# Authentication Integration Guide

## Overview

The frontend and backend are now integrated with a complete authentication system that includes:

- Login API integration
- Session caching using localStorage
- Protected routes
- Automatic login state persistence

## Backend API

### Login Endpoint

**URL:** `POST /api/login`

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": ["username", "name", "email", "field3", "field4", "role"]
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Error Response (500):**

```json
{
  "success": false,
  "message": "Server error"
}
```

## Frontend Implementation

### Auth Service (`src/services/auth.ts`)

The auth service provides the following functions:

#### `login(username: string, password: string)`

- Calls the backend login API
- Caches authentication state in localStorage
- Returns login response

#### `logout()`

- Clears authentication cache
- Removes user data from localStorage

#### `isAuthenticated()`

- Checks if user is authenticated from cache
- Returns boolean

#### `getCachedUser()`

- Retrieves cached user data
- Returns User object or null

#### `getAuthState()`

- Returns complete authentication state
- Includes isAuthenticated and user data

### Login Page (`src/components/LoginPage.tsx`)

Features:

- Form validation
- Loading state during authentication
- Error message display
- Integration with auth service

### App Component (`src/App.tsx`)

Features:

- Checks for cached authentication on mount
- Protects all routes (redirects to login if not authenticated)
- Logout functionality
- Loading screen while checking authentication

## Authentication Flow

1. **Initial Load:**

   - App checks localStorage for cached authentication
   - If authenticated, user stays logged in
   - If not authenticated, shows login page

2. **Login:**

   - User enters username and password
   - LoginPage calls `login()` from auth service
   - Backend validates credentials against Google Sheets
   - On success: user data cached, redirected to UploadPage
   - On failure: error message displayed

3. **Session Persistence:**

   - Authentication state stored in localStorage
   - User remains logged in across browser refreshes
   - No session timeout (persists until logout)

4. **Logout:**

   - User clicks logout button
   - Cache cleared from localStorage
   - Redirected to login page
   - All navigation state reset

5. **Protected Routes:**
   - All pages except LoginPage require authentication
   - Attempting to access without login redirects to LoginPage
   - URL navigation blocked when not authenticated

## Cache Storage

The following data is stored in localStorage:

| Key                    | Value               | Description           |
| ---------------------- | ------------------- | --------------------- |
| `devs_attendance_auth` | `"true"` or removed | Authentication status |
| `devs_attendance_user` | JSON string         | User data object      |

### User Data Structure:

```typescript
{
  username: string;
  name?: string;
  email?: string;
  role?: string;
}
```

## Environment Configuration

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

### Backend (`.env`)

```env
ATTENDANCE_SHEET=YOUR_SHEET_ID
GOOGLE_SHEETS_API_KEY=YOUR_API_KEY
```

## Security Considerations

### Current Implementation:

- ✅ Login credentials validated against Google Sheets
- ✅ Password hashing with salt (SHA-256)
- ✅ CORS protection
- ✅ Client-side route protection

### Recommended Improvements:

- ⚠️ Add JWT tokens for stateless authentication
- ⚠️ Add session timeout/expiry
- ⚠️ Implement refresh token mechanism
- ⚠️ Add HTTPS in production
- ⚠️ Implement rate limiting
- ⚠️ Add CSRF protection
- ⚠️ Store sensitive data in secure cookies (not localStorage)

## Testing

### Manual Testing:

1. **Test Login Success:**

   - Enter valid credentials
   - Verify redirect to UploadPage
   - Verify logout button appears

2. **Test Login Failure:**

   - Enter invalid credentials
   - Verify error message displays
   - Verify stays on login page

3. **Test Session Persistence:**

   - Login successfully
   - Refresh browser
   - Verify still logged in

4. **Test Logout:**

   - Click logout button
   - Verify redirect to login page
   - Verify cache cleared

5. **Test Route Protection:**
   - Logout
   - Try to access other pages by typing URL
   - Verify redirects to login page

## Troubleshooting

### "Network error" on login

- Check backend server is running on port 3000
- Verify VITE_API_URL in frontend .env
- Check browser console for CORS errors

### Login successful but redirects to login

- Check browser localStorage for cached data
- Verify auth service is caching properly
- Check browser console for errors

### Cannot access pages after login

- Verify isLoggedIn state is true
- Check getAuthState() returns correct data
- Verify localStorage has auth data

## API Integration Example

```typescript
import { login, logout, getAuthState } from "./services/auth";

// Login
const result = await login("username", "password");
if (result.success) {
  console.log("Logged in!");
}

// Check auth state
const authState = getAuthState();
if (authState.isAuthenticated) {
  console.log("User:", authState.user);
}

// Logout
logout();
```

## Future Enhancements

1. **Remember Me:** Add option to persist or not persist session
2. **Password Reset:** Implement forgot password functionality
3. **Multi-factor Auth:** Add 2FA support
4. **Session Management:** Track active sessions
5. **Audit Logging:** Log all authentication attempts
6. **Role-based Access:** Restrict features by user role
