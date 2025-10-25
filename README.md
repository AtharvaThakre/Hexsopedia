# Hexsopedia - Personal Knowledge Management System

A full-stack Wikipedia-style web application for creating, organizing, and searching personal knowledge entries with Markdown support, authentication, and an admin dashboard.

## Features

### Core Functionality
- ✅ **User Authentication**: JWT-based authentication with login and registration
- ✅ **CRUD Operations**: Create, read, update, and delete knowledge entries
- ✅ **Search Functionality**: Search entries by title, content, or tags
- ✅ **Markdown Support**: Rich text editor with Markdown formatting
- ✅ **Tagging System**: Organize entries with custom tags
- ✅ **Admin Dashboard**: Manage users, view analytics, and monitor activity

### Key Features
- 📝 Create and edit entries with live Markdown preview
- 🔍 Advanced search by title, content, or multiple tags
- 🏷️ Tag-based organization for easy categorization
- 👁️ View counter for tracking entry popularity
- 🔒 Public/private entry visibility options
- 📊 Analytics dashboard with statistics and insights
- 👥 User management and role-based access control
- 📱 Responsive design for all devices

## Tech Stack

### Backend
- **Node.js** with **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **SimpleMDE** - Markdown editor
- **React Markdown** - Markdown renderer
- **Axios** - HTTP client

## Project Structure

```
Hexsopedia/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Entry.js         # Entry schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── entries.js       # Entry CRUD routes
│   │   └── admin.js         # Admin routes
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── server.js            # Express server setup
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── EntryForm.js
│   │   │   ├── EntryView.js
│   │   │   ├── Search.js
│   │   │   └── AdminDashboard.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Hexsopedia
```

### Step 2: Set Up Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file by copying `.env.example`:
```bash
copy .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hexsopedia
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important**: Change the `JWT_SECRET` to a random secure string in production!

### Step 3: Set Up Frontend

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### Step 4: Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
net start MongoDB
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
```

Or use MongoDB Atlas (cloud) by updating the `MONGODB_URI` in your `.env` file.

### Step 5: Run the Application

1. Start the backend server (from the `backend` directory):
```bash
npm run dev
```
The backend will run on `http://localhost:5000`

2. In a new terminal, start the frontend (from the `frontend` directory):
```bash
npm start
```
The frontend will run on `http://localhost:3000`

## Usage

### Creating Your First Account

1. Open `http://localhost:3000` in your browser
2. Click "Register here" to create a new account
3. Fill in your username, email, and password
4. You'll be automatically logged in after registration

### Creating Entries

1. Click "New Entry" in the navigation bar
2. Enter a title for your entry
3. Write your content using Markdown syntax
4. Add tags to organize your entry (press Enter after each tag)
5. Optionally, check "Make this entry public" to share it
6. Click "Create Entry"

### Markdown Support

The editor supports standard Markdown syntax:
- **Bold**: `**text**`
- *Italic*: `*text*`
- Headings: `# H1`, `## H2`, `### H3`
- Lists: `- item` or `1. item`
- Links: `[text](url)`
- Images: `![alt](url)`
- Code: `` `code` `` or ``` for blocks
- And more!

### Searching Entries

1. Click "Search" in the navigation bar
2. Enter keywords in the search box to search by title/content
3. Or enter comma-separated tags to search by tags
4. Click "Search" to see results

### Admin Features

To access admin features, you need to manually set a user's role to 'admin' in MongoDB:

```javascript
// Connect to MongoDB and run:
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

Admin dashboard features:
- View total users and entries statistics
- Monitor popular tags and trending content
- See entries by user
- View activity over time
- Delete any user's entries
- Track most viewed entries

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Entries
- `GET /api/entries` - Get all user entries (requires auth)
- `GET /api/entries/:id` - Get single entry (requires auth)
- `GET /api/entries/search` - Search entries (requires auth)
- `POST /api/entries` - Create entry (requires auth)
- `PUT /api/entries/:id` - Update entry (requires auth)
- `DELETE /api/entries/:id` - Delete entry (requires auth)

### Admin
- `GET /api/admin/stats` - Get analytics (requires admin)
- `GET /api/admin/users` - Get all users (requires admin)
- `GET /api/admin/entries` - Get all entries (requires admin)
- `DELETE /api/admin/entries/:id` - Delete any entry (requires admin)
- `PUT /api/admin/users/:id/role` - Update user role (requires admin)

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. The build folder can be served by the backend or deployed separately.

3. For production deployment, update the `.env` file:
```env
NODE_ENV=production
MONGODB_URI=<your-production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
```

## Security Considerations

- ✅ Passwords are hashed using bcryptjs
- ✅ JWT tokens for secure authentication
- ✅ Protected routes with authentication middleware
- ✅ Role-based access control for admin features
- ✅ Input validation using express-validator
- ⚠️ Remember to change JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Enable CORS only for trusted domains in production

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please open an issue on GitHub.

## Future Enhancements

- 📧 Email verification for new users
- 🔄 Real-time collaboration
- 📎 File attachments support
- 🌙 Dark mode
- 📱 Mobile app
- 🔔 Notifications system
- 📤 Export entries to PDF/HTML
- 🗂️ Entry categories/folders
- 🔗 Entry linking and backlinks
- 📈 Advanced analytics

---

Built with ❤️ using the MERN stack
