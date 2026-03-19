# Contact & Messaging System - Quick Start

## 🚀 How It Works

```
USER SIDE                          ADMIN SIDE
─────────                          ──────────

Visit Contact Page                 Login as Admin
        ↓                                ↓
Fill Contact Form                  Go to /admin/messages
        ↓                                ↓
Click Send Message               View All Messages
        ↓                                ↓
✅ Success Notification           Unread Count Badge
Message Sent!                      
        ↓                                ↓
Message Stored                     Click Message to View
in Database                        Complete Details
        ↓                                ↓
                                   Type Reply
                                        ↓
                                   Click Send Reply
                                        ↓
                                   User Receives Reply
```

## 📝 Contact Form Fields

| Field | Type | Required | Example |
|-------|------|----------|---------|
| Name | Text | Yes | John Doe |
| Email | Email | Yes | john@example.com |
| Phone | Text | No | +91-9876543210 |
| Category | Select | No | Collaboration |
| Subject | Text | Yes | Commission Inquiry |
| Message | Textarea | Yes | I'd like to commission... |

## 📂 Categories Available

- **General** - General inquiries
- **Collaboration** - Collaboration opportunities
- **Workshop** - Workshop bookings
- **Commission** - Commission requests
- **Other** - Other matters

## 🔧 Admin Dashboard Features

### Left Panel - Message List
- Shows all messages with sender info
- Color-coded by status (new, viewed, replied, closed)
- Click to select and view details
- Shows date of message

### Right Panel - Message Details
- Full message content
- Sender contact information
- Category badge
- Reply status
- Previous reply (if sent)

### Top Panel - Controls
- **Search Box** - Search by name, email, subject, or message content
- **Status Filter** - Filter by new/viewed/replied/closed
- **Unread Badge** - Shows count of unread messages
- **Total Badge** - Shows total messages

## 📊 Message Status Explained

| Status | Meaning | Color |
|--------|---------|-------|
| new | Just arrived, not viewed | Red |
| viewed | Admin has viewed it | Gray |
| replied | Admin has sent a reply | Green |
| closed | Message resolved | Gray |

## ⚡ Quick Actions

### Send Message (User)
1. Go to Contact page
2. Fill required fields (Name, Email, Subject, Message)
3. Select category (optional)
4. Add phone (optional)
5. Click "Send Message"
6. Wait for success notification

### View Messages (Admin)
1. Login
2. Go to `/admin/messages` or Admin Dashboard
3. View unread count at top
4. Click any message to view details

### Reply to Message (Admin)
1. Select message from list
2. Read message content
3. Scroll to "Send Reply" section
4. Type your reply
5. Click "Send Reply"
6. Message status changes to "replied"

### Search Messages (Admin)
1. Type in search box at top
2. Search across all message fields
3. Results update instantly
4. Can combine search with status filter

### Delete Message (Admin)
1. Select message
2. Click "Delete Message" button at bottom
3. Confirm deletion
4. Message removed from system

## 📱 Device Support

- ✅ Desktop (full-width)
- ✅ Tablet (responsive grid)
- ✅ Mobile (single column)

## 🔐 Security

- All messages encrypted in transit (HTTPS)
- Admin endpoints require authentication
- Only admins can view/reply to messages
- User data is private and secure

## 📈 Getting Notifications

Admins can see:
- **Unread Count Badge** - Updated every 30 seconds automatically
- **Status Indicators** - "new" shows unviewed messages
- **Auto-refresh** - Dashboard auto-refreshes unread count

## ⚠️ Important Notes

- **Messages are permanent** - Be careful when deleting
- **Replies are visible** - Senders will see your reply
- **Search is case-insensitive** - Find messages easily
- **Status auto-updates** - When you click, message marked as viewed

## 🎯 Best Practices

### For Users
✅ Provide clear subject line
✅ Include relevant details
✅ Provide valid email address
✅ Add phone if urgent reply needed
✅ Choose appropriate category

### For Admins
✅ Reply promptly to inquiries
✅ Keep replies professional
✅ Delete resolved old messages
✅ Check dashboard regularly
✅ Use search for quick access

## 🔗 Direct URLs

- **Contact Form**: `/contact`
- **Admin Messages**: `/admin/messages`
- **Home Page**: `/`

## 📧 API Endpoints

### Send Message (Public)
```
POST /api/contact/send
Body: {name, email, phone, subject, category, message}
```

### Get Messages (Admin)
```
GET /api/contact/messages
Headers: Authorization: Bearer TOKEN
Query: ?status=new&search=term&limit=20&page=1
```

### Send Reply (Admin)
```
PUT /api/contact/messages/:id/reply
Headers: Authorization: Bearer TOKEN
Body: {reply: "Your reply text"}
```

### Get Unread Count (Admin)
```
GET /api/contact/unread-count
Headers: Authorization: Bearer TOKEN
```

## 🐛 Troubleshooting

### "Message not sending"
- Check if all required fields are filled
- Check internet connection
- Check if server is running
- See browser console for errors

### "Can't see messages as admin"
- Verify you're logged in as admin
- Check if your account has admin role
- Try refreshing the page

### "Search not working"
- Make sure search term is entered
- Check if messages exist with that term
- Clear search box and try again

### "Reply not sending"
- Make sure reply text is not empty
- Check if you have admin permissions
- Try refreshing and selecting message again

## 📞 Contact Information Display

The Contact page shows:
- Email address
- Phone number field
- Studio location
- Contact form

Users can fill the form to get in touch!

---

**Ready to receive messages!** 🎉
