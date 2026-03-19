# Contact & Messaging System - Implementation Guide

## Overview

A complete contact/messaging system has been implemented that allows users to send messages through the "Get in Touch" form, and admins can view, reply to, and manage these messages from an admin dashboard.

## Features Implemented

### User Side (Frontend)
✅ Contact form with fields: Name, Email, Phone, Subject, Category, Message
✅ Form validation and error handling
✅ Success/error notifications
✅ Category selection (General, Collaboration, Workshop, Commission, Other)
✅ Mobile responsive design
✅ Loading states during submission

### Admin Side (Backend & Frontend)
✅ View all incoming messages
✅ Search messages by name, email, subject, or content
✅ Filter messages by status (new, viewed, replied, closed)
✅ Mark messages as read
✅ Reply to messages
✅ Delete messages
✅ View unread message count
✅ Message status tracking
✅ Pagination support

## Architecture

### Database Models

#### Message Model
```javascript
{
  name: String (required),
  email: String (required),
  phone: String,
  subject: String (required),
  message: String (required),
  isRead: Boolean (default: false),
  isReplied: Boolean (default: false),
  reply: String (optional),
  repliedBy: ObjectId (ref: User),
  category: String (enum: General, Collaboration, Workshop, Commission, Other),
  status: String (enum: new, viewed, replied, closed),
  timestamps: true
}
```

### API Endpoints

#### Public Endpoints
- **POST** `/api/contact/send` - Send new message
  ```
  Body: {
    name: string (required),
    email: string (required),
    phone: string (optional),
    subject: string (required),
    message: string (required),
    category: string (optional, default: "Other")
  }
  
  Response: { success: true, message: "...", data: messageObject }
  ```

#### Admin-Only Endpoints
- **GET** `/api/contact/messages` - Get all messages with filters
  ```
  Query params: status, search, limit, page
  Auth: Required (Admin only)
  ```

- **GET** `/api/contact/unread-count` - Get unread and new message counts
  ```
  Auth: Required (Admin only)
  ```

- **GET** `/api/contact/messages/:id` - Get single message (marks as read)
  ```
  Auth: Required (Admin only)
  ```

- **PUT** `/api/contact/messages/:id/reply` - Send reply to message
  ```
  Body: { reply: string (required) }
  Auth: Required (Admin only)
  ```

- **PUT** `/api/contact/messages/:id/read` - Mark message as read
  ```
  Auth: Required (Admin only)
  ```

- **DELETE** `/api/contact/messages/:id` - Delete message
  ```
  Auth: Required (Admin only)
  ```

- **GET** `/api/contact/category/:category` - Get messages by category
  ```
  Query params: status, limit, page
  Auth: Required (Admin only)
  ```

## File Structure

### Backend Files

```
BACKEND/src/
├── models/
│   └── Message.js (NEW)
├── Controllers/
│   └── contact.controller.js (NEW)
├── routes/
│   └── contact.route.js (NEW)
└── app.js (UPDATED - added contact routes)
```

### Frontend Files

```
FRUNTEND/src/
├── Components/
│   ├── Contact.jsx (UPDATED - full form implementation)
│   └── AdminMessages.jsx (NEW - admin dashboard)
└── App.jsx (UPDATED - added admin/messages route)
```

## Usage

### For Users - Sending Messages

1. Navigate to the "Contact" page or "Get In Touch" section
2. Fill in the form:
   - **Name** (required)
   - **Email** (required)
   - **Phone** (optional)
   - **Category** (dropdown - select a category)
   - **Subject** (required)
   - **Message** (required)
3. Click "Send Message"
4. See success notification
5. Message is received by admin

### For Admins - Managing Messages

#### Accessing Admin Messages Dashboard
1. Login with admin account
2. Navigate to `/admin/messages`
3. View dashboard with:
   - Unread count badge
   - Total messages count
   - Search box
   - Status filter dropdown

#### Actions Available
- **Search** - Find messages by name, email, subject, or content
- **Filter** - Show messages by status (new, viewed, replied, closed)
- **Select Message** - Click message to view full content
- **Mark as Read** - Automatically marked when viewing
- **Reply** - Type reply and send (marks as "replied")
- **Delete** - Remove message permanently

#### Viewing Messages
- Click any message in the list to view details
- See sender info, category, subject, and content
- View previous reply if sent
- Send reply or delete message

#### Replying to Messages
1. Select message from list
2. Scroll to "Send Reply" section
3. Type reply message
4. Click "Send Reply"
5. Reply is saved and message status changes to "replied"

## Message Status Flow

```
User sends message
        ↓
Status: "new" (isRead: false)
        ↓
Admin clicks message / calls getMessage endpoint
        ↓
Status: "viewed" (isRead: true)
        ↓
Admin sends reply
        ↓
Status: "replied" (isReplied: true)
        ↓
Admin can delete or keep for records
```

## Frontend Components

### Contact Component (`Contact.jsx`)
- **Location**: `/contact` route, also on homepage
- **Features**:
  - Full contact form with validation
  - 5 categories to choose from
  - Success/error notifications
  - Loading states
  - API integration

### AdminMessages Component (`AdminMessages.jsx`)
- **Location**: `/admin/messages` route (admin only)
- **Features**:
  - Messages list with status indicators
  - Real-time unread count
  - Search functionality
  - Status filtering
  - Message detail view
  - Reply system
  - Delete functionality
  - Auto-refresh unread count every 30 seconds

## Validation & Error Handling

### Frontend Validation
- ✅ Name: Required, non-empty
- ✅ Email: Required, valid format
- ✅ Subject: Required, non-empty
- ✅ Message: Required, non-empty
- ✅ File size/type: Not applicable

### Backend Validation
- ✅ All required fields present
- ✅ Email format validation
- ✅ Message length limits (max 5000 chars)
- ✅ Subject length limits (max 200 chars)
- ✅ Admin role verification

### Error Messages
- "Please provide name, email, subject, and message"
- "Please provide a valid email"
- "Please enter your reply"
- "Error sending message"
- "Only admins can access this resource"

## Security Features

✅ **Authentication Required** - All admin endpoints require JWT token
✅ **Admin-Only Access** - Contact management restricted to admins
✅ **Input Validation** - Both frontend and backend validation
✅ **CORS Protected** - Requests only from authorized frontend
✅ **Status Tracking** - Never expose internal data unnecessarily
✅ **User Verification** - Admin can only reply to genuine messages

## Testing

### Test Case 1: User Sends Message
```
1. Navigate to Contact page
2. Fill all required fields
3. Select a category
4. Click "Send Message"
5. Expected: Success notification, form cleared
6. Backend: Message created with status "new"
```

### Test Case 2: Admin Views Messages
```
1. Login as admin
2. Navigate to /admin/messages
3. Expected: See all messages in list
4. Click message
5. Expected: Message detail displays, isRead = true
```

### Test Case 3: Admin Replies to Message
```
1. Select a message
2. Scroll to reply section
3. Type reply
4. Click "Send Reply"
5. Expected: Reply sent, status = "replied"
6. Backend: Message updated with reply and repliedBy
```

### Test Case 4: Admin Deletes Message
```
1. Select a message
2. Click "Delete Message"
3. Confirm deletion
4. Expected: Message removed from list
5. Backend: Message deleted from database
```

### Test Case 5: Search Functionality
```
1. Type search term in search box
2. Messages filter in real-time
3. Expected: Only matching messages shown
4. Backend: Regex search on name, email, subject, message
```

### Test Case 6: Filter by Status
```
1. Select status from dropdown
2. Expected: Only messages with that status shown
3. Can combine with search
```

## Database Migration

If adding to existing installation:

```javascript
// MongoDB - Create Message collection with index
db.messages.createIndex({ email: 1 })
db.messages.createIndex({ status: 1 })
db.messages.createIndex({ createdAt: -1 })
db.messages.createIndex({ "name": "text", "email": "text", "subject": "text", "message": "text" })
```

## API Response Examples

### Send Message - Success
```json
{
  "success": true,
  "message": "Message sent successfully. We will get back to you soon!",
  "data": {
    "_id": "65a...",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Commission Inquiry",
    "category": "Commission",
    "status": "new",
    "isRead": false,
    "createdAt": "2024-02-15T10:30:00Z"
  }
}
```

### Get Messages - Success
```json
{
  "success": true,
  "count": 10,
  "totalMessages": 25,
  "totalPages": 3,
  "currentPage": 1,
  "data": [
    {
      "_id": "65a...",
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Commission Inquiry",
      "status": "new",
      "category": "Commission",
      "isRead": false,
      "createdAt": "2024-02-15T10:30:00Z"
    }
  ]
}
```

### Send Reply - Success
```json
{
  "success": true,
  "message": "Reply sent successfully",
  "data": {
    "_id": "65a...",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Commission Inquiry",
    "reply": "Thank you for your interest. Let's discuss details...",
    "status": "replied",
    "isReplied": true,
    "repliedBy": {
      "_id": "admin_id",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "updatedAt": "2024-02-15T11:00:00Z"
  }
}
```

## Performance Considerations

- ✅ Messages paginated (20 per page by default)
- ✅ Search indexed for faster queries
- ✅ Unread count cached (refreshed every 30s)
- ✅ Lazy loading in admin dashboard
- ✅ Status filtering reduces payload

## Future Enhancements

- [ ] Email notifications when new message arrives
- [ ] Email notifications when reply is sent
- [ ] Message export to CSV
- [ ] Analytics dashboard (messages per category, response time, etc.)
- [ ] Auto-close messages after X days of no reply
- [ ] Attachment support for messages
- [ ] Message templates for quick replies
- [ ] Bulk actions (mark all as read, bulk delete, etc.)
- [ ] Message categories management UI
- [ ] Rate limiting to prevent spam

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Message not sending | Check all required fields filled, check network request in DevTools |
| Admin can't see messages | Verify admin role in database (role: "admin", isAdmin: true) |
| Reply not showing | Refresh page, check if reply was actually sent (no error message) |
| Search not working | Check MongoDB text index is created |
| Unread count not updating | Manually refresh page or wait 30 seconds for auto-refresh |

## Database Indexes

For optimal performance, create these indexes:

```javascript
// Message collection indexes
db.messages.createIndex({ status: 1, createdAt: -1 })
db.messages.createIndex({ email: 1 })
db.messages.createIndex({ isRead: 1 })
db.messages.createIndex({ category: 1 })
db.messages.createIndex(
  { name: "text", email: "text", subject: "text", message: "text" },
  { default_language: "english" }
)
```

## Deployment Notes

- ✅ Update MONGO_URI environment variable
- ✅ Ensure JWT authentication is working
- ✅ Test email validation regex
- ✅ Configure CORS for production
- ✅ Set up database backups for messages
- ✅ Consider implementing message archival strategy

---

**Contact System Implementation Complete!** 🎉

Users can easily contact you, and you have a complete admin dashboard to manage all inquiries.
