# Hexsopedia - Personal Knowledge Management System

Deployment Link
https://codebreakers-landingpage.vercel.app/

A full-stack Wikipedia-style web application for creating, organizing, and searching personal knowledge entries with Markdown support, authentication, and an admin dashboard.

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

## Security Considerations

- ✅ Passwords are hashed using bcryptjs
- ✅ JWT tokens for secure authentication
- ✅ Protected routes with authentication middleware
- ✅ Role-based access control for admin features
- ✅ Input validation using express-validator
- ⚠️ Remember to change JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Enable CORS only for trusted domains in production

Built with ❤️ using the MERN stack
