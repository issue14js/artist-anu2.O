# Authentication Integration Guide

## Overview
Authentication has been successfully integrated into your Artist Portfolio application. The system includes user registration, login, and logout functionality with JWT-based session management.

## What Was Added

### Frontend Changes

#### 1. **New Components**
- **Login.jsx** - Login form component with email and password fields
- **Signup.jsx** - Registration form component with name, email, and password confirmation
- **AuthContext.jsx** - Context provider for global authentication state management

#### 2. **Updated Files**
- **App.jsx** - Added AuthProvider wrapper and new routes (/login, /signup)
- **Navbar.jsx** - Added user profile display and logout button
- **package.json** - Added axios dependency for HTTP requests

#### 3. **New Directories**
- `src/context/` - Contains AuthContext.jsx for state management

#### 4. **Configuration Files**
- `.env` - Frontend environment variables (VITE_API_URL)
- `.env.example` - Example environment file

### Backend Changes

#### 1. **Updated Files**
- **app.js** - Added CORS configuration to allow frontend communication
- **.env** - Added JWT_SECRET, NODE_ENV, and FRONTEND_URL
- **package.json** - Added cors dependency

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB Atlas connection string (already configured)

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd BACKEND
   npm install
   ```

2. **Verify .env file:**
   - Check `MONGO_URI` is correctly set
   - Ensure `JWT_SECRET` is configured (change the default for production)
   - Verify `FRONTEND_URL` points to your frontend (http://localhost:5173 for dev)

3. **Update server port if needed:**
   - Default: 3000
   - Edit in `server.js` if you need a different port

4. **Start the backend:**
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:3000

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd FRUNTEND
   npm install
   ```

2. **Verify .env file:**
   - `VITE_API_URL=http://localhost:3000/api` (matches your backend URL)

3. **Start the frontend:**
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## API Endpoints

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/signup`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }
  ```
- **Response:** User object with JWT token

#### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** User object with JWT token

#### Logout
- **POST** `/api/auth/logout`
- **Headers:** Authorization or Cookie (JWT)
- **Protected:** Yes

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** Authorization or Cookie (JWT)
- **Protected:** Yes
- **Response:** Current user object

## Frontend Features

### AuthContext Methods
```javascript
// Available in any component using useContext(AuthContext)
{
  user,           // Current logged-in user or null
  loading,        // Loading state during API calls
  error,          // Error message if any
  signup(),       // Function to register new user
  login(),        // Function to login user
  logout(),       // Function to logout user
  setError()      // Function to clear errors
}
```

### Usage Example
```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout } = useContext(AuthContext);
  
  return (
    <div>
      {user && <p>Welcome, {user.name}</p>}
      {!user && <button onClick={() => login(email, password)}>Login</button>}
      {user && <button onClick={logout}>Logout</button>}
    </div>
  );
}
```

## Key Features

✅ **User Registration** - New users can create accounts with validation
✅ **User Login** - Existing users can log in securely
✅ **JWT Tokens** - Secure token-based authentication
✅ **HTTP-Only Cookies** - Tokens stored in secure cookies
✅ **Protected Routes** - Backend routes protected with middleware
✅ **CORS Support** - Frontend and backend can communicate
✅ **Error Handling** - User-friendly error messages
✅ **Responsive UI** - Mobile-friendly login/signup forms
✅ **Navbar Integration** - Shows user info and logout button

## Security Notes

1. **Change JWT_SECRET** - Update the default JWT secret in `.env` before production
2. **HTTPS Only** - Use HTTPS in production
3. **Secure Cookies** - Cookies are httpOnly and secure in production
4. **CORS Whitelist** - Only your frontend domain is allowed to access the API

## Troubleshooting

### "Failed to fetch" errors
- Ensure backend is running on port 3000
- Check CORS configuration in backend `.env`
- Verify `VITE_API_URL` in frontend `.env` is correct

### "Invalid token" errors
- Clear browser cookies and try logging in again
- Ensure JWT_SECRET is the same in backend `.env`
- Check token expiration (default: 7 days)

### Database connection errors
- Verify MongoDB Atlas connection string in `.env`
- Check internet connection for MongoDB access
- Ensure IP is whitelisted in MongoDB Atlas

## Next Steps

1. ✅ Run `npm install` in both BACKEND and FRUNTEND directories
2. ✅ Verify .env files are correctly configured
3. ✅ Run the backend: `npm run dev` in BACKEND directory
4. ✅ Run the frontend: `npm run dev` in FRUNTEND directory
5. ✅ Test by registering a new account and logging in

---

**Questions or Issues?** Check the console for detailed error messages and ensure both applications are running properly.
