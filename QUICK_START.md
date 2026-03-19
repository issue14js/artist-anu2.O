# Gallery Post Upload Feature - Quick Start Guide

## 🚀 Quick Setup

### Backend Setup (First Time)
```bash
cd BACKEND
npm install multer
```

The uploads folder will be created automatically when you upload your first image.

### Environment Check
Make sure your `BACKEND/.env` has:
```
MONGO_URI=your_database_url
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

## 📖 How to Use

### For Admins - Uploading Posts

1. **Login** to your account (top right corner)
2. Look for the **floating "+" button** in the bottom-right corner
3. Click it to open the upload modal
4. Fill in the form:
   - **Title**: Name of your artwork (required)
   - **Description**: Details about the post (required)
   - **Category**: Choose from dropdown (Traditional, Education, Painting, etc.)
   - **Image**: Upload JPG, PNG, or GIF (max 5MB)
5. Click **"Upload Post"** button
6. **Success!** Your post will appear in the gallery instantly

### For Everyone - Viewing Gallery

1. Go to the **Gallery** page
2. See the **category filters** at the top (All, Traditional, Education, etc.)
3. Click any category to filter posts
4. **Hover over posts** to see full details:
   - Title
   - Category
   - Description snippet
   - View count

## 📁 Where Files Are Created

- **Uploaded images**: `BACKEND/uploads/posts/`
- **Posts data**: Stored in MongoDB
- **Frontend components**: `FRUNTEND/src/Components/`

## ⚙️ How It Works Behind the Scenes

```
User Uploads Image
        ↓
AdminPostUpload Component collects form data
        ↓
Sends FormData to: POST /api/posts/upload
        ↓
Backend validates file and saves to uploads/posts/
        ↓
Post data saved to MongoDB
        ↓
Image URL returned and saved in database
        ↓
Gallery refreshes and fetches new posts
        ↓
New post appears in gallery for everyone!
```

## 🔒 Security Features

- ✅ Only logged-in users can upload
- ✅ Users can only edit/delete their own posts
- ✅ File type validation (images only)
- ✅ File size limit: 5MB
- ✅ JWT authentication required
- ✅ Proper CORS settings

## 📊 Features

| Feature | Status |
|---------|--------|
| Upload images | ✅ |
| Multiple categories | ✅ |
| Category filtering | ✅ |
| View counter | ✅ |
| User ownership | ✅ |
| Edit/Delete posts | ✅ |
| Image preview | ✅ |
| Form validation | ✅ |
| Error messages | ✅ |
| Responsive design | ✅ |

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Floating button not showing | Make sure you're logged in |
| Upload fails - "Not authorized" | Check if JWT token is valid |
| Image not displaying | Check image URL in browser DevTools |
| File too large error | Resize image to be less than 5MB |
| CORS error | Verify FRONTEND_URL in .env matches your frontend URL |

## 📱 File Size Limits

- **Maximum image size**: 5MB
- **Supported formats**: JPG, PNG, GIF, WebP
- **Recommended**: Keep images under 2MB for faster loading

## 🔄 API Response Example

### Successful Upload
```json
{
  "success": true,
  "message": "Post uploaded successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "title": "My Beautiful Artwork",
    "description": "A stunning traditional painting",
    "category": "Traditional",
    "imageUrl": "/uploads/posts/image-1234567890.jpg",
    "uploadedBy": "user_id",
    "views": 0,
    "createdAt": "2024-02-15T10:30:00Z"
  }
}
```

## 💡 Tips for Best Results

1. **Image Quality**: Upload clear, high-quality images
2. **Description**: Write detailed descriptions to help visitors understand your work
3. **Categories**: Choose the most accurate category for better organization
4. **File Size**: Compress images before uploading for faster loading
5. **Titles**: Use descriptive titles that capture the essence of your work

## 🎯 Next Steps

1. Start your frontend: `cd FRUNTEND && npm run dev`
2. Start your backend: `cd BACKEND && npm run dev`
3. Login to your account
4. Click the floating "+" button
5. Upload your first post!

## 📞 Need Help?

Check the detailed implementation guide at:
- `IMPLEMENTATION_GUIDE.md`

For API documentation and troubleshooting, see:
- Backend logs: Check terminal output
- Browser console: Check for JavaScript errors
- Network tab: Check API requests and responses

---

**Happy uploading! 🎨**
