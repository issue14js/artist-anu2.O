# Gallery Post Upload Feature - Implementation Guide

## Overview
This implementation adds a complete admin post upload feature to the Artist portfolio application. Admins can upload posts with title, description, category, and images to the gallery, which are then dynamically displayed to all users.

## Features Implemented

### Backend Features
1. **Post Model** - Mongoose schema for storing post data
   - Title, Description, Image URL
   - Category (Traditional, Education, Painting, Wall Art, Learning, Other)
   - Upload tracking (uploadedBy, timestamps)
   - View counter

2. **File Upload Handler** - Multer configuration
   - Image storage in `uploads/posts/` directory
   - File size limit: 5MB
   - Supported formats: JPEG, JPG, PNG, GIF, WebP

3. **Post Controller** - RESTful API endpoints
   - `POST /api/posts/upload` - Upload new post (authenticated)
   - `GET /api/posts` - Get all posts with filtering
   - `GET /api/posts/:id` - Get single post with view counter
   - `PUT /api/posts/:id` - Update post (owner only)
   - `DELETE /api/posts/:id` - Delete post (owner only)
   - `GET /api/posts/user/:userId` - Get user's posts

4. **Static File Serving**
   - Uploads served via `/uploads/` route
   - Integrated with Express static middleware

### Frontend Features
1. **AdminPostUpload Component** (`components/AdminPostUpload.jsx`)
   - Floating button for authenticated users
   - Modal form with:
     - Title input
     - Description textarea
     - Category dropdown
     - Image preview and upload
   - Form validation
   - Success/Error messaging
   - Loading states

2. **Enhanced Gallery Component** (`components/Gallery.jsx`)
   - Dynamic post fetching from backend
   - Category filtering
   - Fallback to default images if API unavailable
   - Image error handling
   - View count and creation date display
   - Responsive grid layout

3. **Integration in App.jsx**
   - AdminPostUpload component available globally
   - Only visible to authenticated users

## Installation & Setup

### Backend Setup
```bash
# Navigate to backend directory
cd BACKEND

# Install multer dependency
npm install multer

# The uploads folder will be created automatically
# Make sure uploads/posts/ directory exists or create manually:
mkdir -p uploads/posts
```

### Environment Variables
Add to `BACKEND/.env`:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd FRUNTEND

# Ensure axios is installed (already available)
npm install

# Update .env if needed
VITE_API_URL=http://localhost:5000/api
```

## File Structure

### Backend
```
BACKEND/
├── src/
│   ├── Controllers/
│   │   ├── auth.controller.js
│   │   ├── profile.controller.js
│   │   └── post.controller.js (NEW)
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js (NEW)
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── profile.route.js
│   │   └── post.route.js (NEW)
│   ├── config/
│   │   ├── database.js
│   │   └── multer.js (NEW)
│   ├── middleware/
│   │   └── auth.middleware.js
│   └── app.js (UPDATED)
├── uploads/ (NEW - auto-created on upload)
│   └── posts/
├── server.js
└── package.json
```

### Frontend
```
FRUNTEND/
├── src/
│   ├── Components/
│   │   ├── Gallery.jsx (UPDATED)
│   │   ├── AdminPostUpload.jsx (NEW)
│   │   └── ... other components
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx (UPDATED)
│   └── ...
├── package.json
└── ...
```

## API Endpoints

### Public Endpoints
- `GET /api/posts` - Get all posts (with optional category filter)
  - Query params: `category`, `limit`, `skip`
  
- `GET /api/posts/:id` - Get single post and increment view count

- `GET /api/posts/user/:userId` - Get all posts by a user

### Protected Endpoints (Require Authentication)
- `POST /api/posts/upload` - Upload new post
  - Body: FormData with `title`, `description`, `category`, `image`
  - Response: Uploaded post object

- `PUT /api/posts/:id` - Update post
  - Body: FormData with `title`, `description`, `category`, optional `image`
  - Response: Updated post object

- `DELETE /api/posts/:id` - Delete post
  - Response: Success message

## Usage

### For Users (Viewing)
1. Users visit the Gallery page
2. Gallery automatically fetches posts from the backend
3. Users can filter posts by category
4. Users can hover over posts to see details

### For Admins (Uploading)
1. Admin logs in to their account
2. Floating "+" button appears in bottom-right corner
3. Click button to open upload modal
4. Fill in post details:
   - Title: 100 characters max
   - Description: 2000 characters max
   - Category: Select from dropdown
   - Image: Upload JPG/PNG/GIF up to 5MB
5. Click "Upload Post" to submit
6. Post appears in gallery immediately after upload
7. Can edit or delete posts anytime

## Error Handling

The system includes comprehensive error handling:
- File size validation (5MB limit)
- File type validation (images only)
- Required field validation
- Database connection errors
- File system errors (automatically cleans up on failure)
- Proper HTTP status codes and messages

## Security Considerations

1. **Authentication** - All upload/edit/delete operations require JWT authentication
2. **Authorization** - Users can only edit/delete their own posts
3. **File Validation** - Both client-side and server-side file validation
4. **CORS** - Configured to only accept requests from frontend origin

## Performance Optimizations

1. **Image Compression** - Consider adding image compression middleware
2. **Caching** - Gallery uses client-side caching of posts
3. **Pagination** - API supports limit/skip for pagination
4. **View Tracking** - Efficient view counter using MongoDB $inc operator

## Future Enhancements

1. Add image compression before upload
2. Implement CDN integration for faster image serving
3. Add bulk upload functionality
4. Add post scheduling (publish date)
5. Add likes/comments on posts
6. Add image cropping/editing before upload
7. Implement search functionality across posts
8. Add statistics/analytics dashboard

## Testing Commands

### Backend Testing
```bash
# Test upload endpoint with cURL
curl -X POST http://localhost:5000/api/posts/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Cookie: jwt=YOUR_JWT_COOKIE" \
  -F "title=Test Post" \
  -F "description=Test Description" \
  -F "category=Traditional" \
  -F "image=@path/to/image.jpg"

# Get all posts
curl http://localhost:5000/api/posts

# Get posts by category
curl "http://localhost:5000/api/posts?category=Traditional"
```

### Frontend Testing
1. Start frontend dev server: `npm run dev`
2. Start backend server: `npm run dev`
3. Login/Signup to create account
4. Click floating "+" button in bottom-right
5. Fill form and upload test image
6. Verify post appears in gallery

## Troubleshooting

**Issue**: Uploads folder not created
- **Solution**: Manually create `BACKEND/uploads/posts/` directory

**Issue**: Image not displaying in gallery
- **Solution**: Check image URL format and CORS settings

**Issue**: Upload fails with "Not authorized" error
- **Solution**: Ensure JWT token is valid and not expired

**Issue**: File upload size error
- **Solution**: Ensure file is less than 5MB

**Issue**: CORS errors
- **Solution**: Check FRONTEND_URL in backend .env matches actual frontend URL

## Support

For issues or questions about this implementation, check:
1. Backend logs for API errors
2. Browser console for frontend errors
3. Network tab in DevTools for API requests
4. MongoDB compass for database records
