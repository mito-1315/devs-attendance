# 🚀 Quick Start Guide

## Prerequisites

- Node.js installed
- Google Sheets API credentials configured
- Environment variables set up

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies

```powershell
cd backend
npm install
```

#### Configure Environment Variables

Make sure `backend/.env` has:

```env
ATTENDANCE_SHEET=YOUR_GOOGLE_SHEET_ID
GOOGLE_SHEETS_API_KEY=YOUR_API_KEY
PORT=3000
```

#### Start Backend Server

```powershell
npm start
```

✅ Backend should now be running on `http://localhost:3000`

### 2. Frontend Setup

#### Install Dependencies

```powershell
cd frontend
npm install
```

#### Configure Environment Variables

Make sure `frontend/.env` has:

```env
VITE_API_URL=http://localhost:3000/api
```

#### Start Frontend Development Server

```powershell
npm run dev
```

✅ Frontend should now be running on `http://localhost:5173`

## 🧪 Testing the Integration

### Test 1: Health Check

Open browser and navigate to:

```
http://localhost:3000/api/health
```

Expected response:

```json
{
  "success": true,
  "status": "server is running"
}
```

### Test 2: Login Page

Navigate to:

```
http://localhost:5173
```

You should see the login page.

### Test 3: Login Functionality

1. **Test Invalid Login:**

   - Enter wrong username/password
   - Click "Login"
   - Should see error message: "Invalid credentials"

2. **Test Valid Login:**

   - Enter correct credentials from Google Sheet
   - Click "Login"
   - Should redirect to Upload Page
   - Logout button should appear in top-right

3. **Test Session Persistence:**

   - Refresh the page (F5)
   - Should remain logged in
   - Should stay on current page

4. **Test Logout:**

   - Click "Logout" button
   - Should redirect to login page
   - Should clear session

5. **Test Protected Routes:**
   - Logout
   - Try accessing: `http://localhost:5173/` (should show login)
   - Cannot navigate to other pages without login

## 📊 Google Sheets Structure

Your Google Sheet should have the following columns:

| A        | B    | C     | D      | E      | F    | G    | H    |
| -------- | ---- | ----- | ------ | ------ | ---- | ---- | ---- |
| Username | Name | Email | Field3 | Field4 | Role | Hash | Salt |

Example row:

```
john_doe | John Doe | john@example.com | ... | ... | admin | <hash> | <salt>
```

## 🔐 Creating Login Credentials

Use the encrypter utility to generate hash and salt:

```powershell
cd backend
node middleware/encrypter.js
```

Or use the function directly:

```javascript
import { encrypter } from "./middleware/encrypter.js";

const result = encrypter("your_password");
console.log("Salt:", result.salt);
console.log("Hash:", result.hash);
```

Add the generated salt and hash to columns G and H in your Google Sheet.

## 🐛 Troubleshooting

### Backend won't start

- Check if port 3000 is already in use
- Verify all dependencies are installed: `npm install`
- Check .env file exists and has correct values
- Verify Google Sheets credentials file exists

### Frontend won't start

- Check if port 5173 is already in use
- Verify all dependencies are installed: `npm install`
- Check .env file exists
- Clear node_modules and reinstall if needed

### Login fails with "Network error"

- Verify backend is running on port 3000
- Check CORS is enabled in backend
- Verify VITE_API_URL in frontend .env
- Open browser console for detailed errors

### Login succeeds but redirects back to login

- Check browser localStorage for cached data
- Open DevTools → Application → Local Storage
- Verify `devs_attendance_auth` = "true"
- Check console for JavaScript errors

### Cannot access Google Sheets

- Verify credentials file exists: `devs-attendance-487205-e88066b2a86e.json`
- Check ATTENDANCE_SHEET ID in .env
- Verify Sheet is shared with service account email
- Check Google Sheets API is enabled

## 📁 File Structure Overview

```
backend/
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── .env                   # Environment variables
├── package.json           # Dependencies
├── controller/
│   └── loginController.js # Login logic
├── middleware/
│   ├── encrypter.js      # Password encryption
│   ├── googlesheetsapi.js # Google Sheets client
│   └── passwordChecker.js # Password validation
├── routes/
│   ├── index.js          # Main router
│   └── loginRoutes.js    # Login routes
└── storage/
    └── loginStorage.js   # Data access layer

frontend/
├── src/
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   ├── components/
│   │   └── LoginPage.tsx # Login UI
│   └── services/
│       └── auth.ts       # Authentication service
├── .env                  # Environment variables
└── package.json          # Dependencies
```

## 🎯 Next Steps

After successful integration:

1. **Test all features thoroughly**
2. **Add more users to Google Sheet**
3. **Customize error messages**
4. **Add loading animations**
5. **Implement additional features**
6. **Deploy to production**

## 📚 Additional Documentation

- `AUTHENTICATION.md` - Detailed authentication documentation
- `INTEGRATION_SUMMARY.md` - Integration overview
- `backend/README.md` - Backend API documentation

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review browser console for errors
3. Check terminal output for server errors
4. Verify all environment variables are set
5. Ensure Google Sheets structure matches expected format
