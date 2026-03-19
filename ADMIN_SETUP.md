# Admin Setup Guide - Gallery Post Upload Feature

## Overview

The gallery post upload feature is now restricted to **admin users only**. This guide explains how to set up admins and manage roles.

## Admin Features

✅ Upload posts to gallery (title, description, image, category)  
✅ Edit their own posts  
✅ Delete their own posts  
✅ Manage user roles (promote/demote users)  
✅ View all users and their roles  

## How to Make Someone an Admin

### Method 1: Using MongoDB Directly (Quick Setup)

1. Open MongoDB Compass or your MongoDB client
2. Connect to your database
3. Find the `users` collection
4. Locate the user you want to make admin
5. Update the document by adding/editing these fields:
   ```json
   {
     "role": "admin",
     "isAdmin": true
   }
   ```
6. Save the changes
7. User will be admin on their next login

### Method 2: Using Admin API (After First Admin Exists)

If you already have one admin user, they can promote others using this API:

**Endpoint**: `PUT /api/admin/users/:userId/promote`  
**Headers**:
```
Authorization: Bearer JWT_TOKEN
Cookie: jwt=JWT_COOKIE
Content-Type: application/json
```

**Example using cURL**:
```bash
curl -X PUT http://localhost:5000/api/admin/users/USER_ID/promote \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Cookie: jwt=YOUR_JWT_COOKIE" \
  -H "Content-Type: application/json"
```

**Response**:
```json
{
  "success": true,
  "message": "User promoted to admin",
  "data": {
    "id": "userid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "isAdmin": true
  }
}
```

### Method 3: Manual Role Assignment via API

**Endpoint**: `PUT /api/admin/users/:userId/role`  
**Headers**: Same as Method 2  
**Body**:
```json
{
  "role": "admin"
}
```

## Current Admin Features

### 1. Upload Posts
- Click floating "+" button (only visible to admins)
- Fill form with title, description, category, and image
- Post appears immediately in gallery

### 2. Manage Users (Admin Panel)

Available endpoints:

**Get All Users**
```bash
GET /api/admin/users
```

**Get Single User**
```bash
GET /api/admin/users/:userId
```

**Update User Role**
```bash
PUT /api/admin/users/:userId/role
Body: { "role": "admin" | "user" }
```

**Promote User to Admin**
```bash
PUT /api/admin/users/:userId/promote
```

**Demote Admin to User**
```bash
PUT /api/admin/users/:userId/demote
```

## Frontend Display

### For Admins
- See floating "+" button in bottom-right corner
- Can upload new posts anytime
- Button only appears when `user.isAdmin === true` or `user.role === "admin"`

### For Regular Users
- Floating button is NOT visible
- Can only view gallery
- Cannot upload posts

## Backend Verification

All post write operations (upload, edit, delete) require:

1. ✅ Authentication (JWT token)
2. ✅ Admin role check (middleware)
3. ✅ Ownership verification (only for edit/delete)

## User Model Fields

Users now have these role-related fields:

```javascript
{
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}
```

When role is set to "admin", isAdmin should also be true.

## Step-by-Step Initial Setup (First Time)

### Step 1: Create your account
1. Sign up on the website
2. Note your user ID from MongoDB or API response

### Step 2: Make yourself admin (via MongoDB)
1. Connect to MongoDB
2. Find your user document
3. Update: `{ "role": "admin", "isAdmin": true }`
4. Click "Logout" and "Login" again

### Step 3: Test upload feature
1. After login, check for floating "+" button
2. Click it and upload a test post
3. Go to gallery and verify post appears

### Step 4: Promote other admins (optional)
Use the API method above to promote other users to admin

## API Error Responses

### Not an Admin
```json
{
  "success": false,
  "error": "Only admins can perform this action"
}
```

### Not Authenticated
```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

### Trying to upload as non-admin
```json
{
  "success": false,
  "error": "Only admins can perform this action"
}
```

## Testing

### Test 1: Admin Can Upload
1. Login as admin
2. Click "+" button
3. Upload post ✅
4. See post in gallery ✅

### Test 2: Regular User Cannot Upload
1. Login as regular user
2. "+" button should NOT appear ❌
3. Try calling upload API manually → Error ❌

### Test 3: Admin API Access
1. Login as admin
2. Call `GET /api/admin/users` → Works ✅
3. Call `PUT /api/admin/users/{userId}/promote` → Works ✅

### Test 4: Regular User API Blocked
1. Login as regular user
2. Call `GET /api/admin/users` → Error ❌
3. Call `PUT /api/admin/users/{userId}/role` → Error ❌

## Security Notes

- Admin role is verified on every protected request
- JWT token includes user ID (role not in JWT, fetched from DB)
- Admins can only manage posts/users, not delete other admins
- All admin actions are logged (implement in production)

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Floating button not showing | Check if `isAdmin` is true in user object |
| Upload fails with "Only admins" error | User is not marked as admin in database |
| Promotion API returns error | Only existing admins can promote others |
| Frontend doesn't show admin status | Clear browser cache and re-login |

## Future Enhancements

- [ ] Admin dashboard for managing posts
- [ ] Admin dashboard for managing users
- [ ] Activity logging for admin actions
- [ ] Admin approval workflow for user uploads
- [ ] Multiple admin levels (super-admin, moderator)
- [ ] Ban/suspend user functionality

## Database Migration (For Existing Users)

If you already have users in the database, you need to add the role fields:

**MongoDB Query**:
```javascript
// Add fields to all existing users
db.users.updateMany(
  {},
  {
    $set: {
      role: "user",
      isAdmin: false
    }
  }
)

// Make a specific user admin
db.users.updateOne(
  { email: "admin@example.com" },
  {
    $set: {
      role: "admin",
      isAdmin: true
    }
  }
)
```

---

**Your admin feature is ready!** 🎉
