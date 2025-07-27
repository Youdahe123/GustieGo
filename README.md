# GustieGo - Cafeteria Shift Management System (go to backend branch for info about REST API)

A modern shift management system for Gustavus Adolphus College cafeteria, built with React, TypeScript, and MongoDB/Express.js backend.

## 🚀 Features

### Student Features

- **Browse Available Shifts**: View all available shifts by location and time
- **Claim Shifts**: Instantly claim available shifts with one click
- **Give Away Shifts**: Transfer claimed shifts to other students
- **View Current & Past Shifts**: Track your shift history and current assignments
- **See Attendance Status**: Monitor your attendance and performance
- **Weekend Shift Tracking**: Ensure compliance with weekend shift requirements

### Admin Features

- **Create New Shifts**: Add one-time or recurring shifts with custom parameters
- **Manage Shift Status**: Activate, deactivate, or cancel shifts
- **Central Shift Management**: Comprehensive dashboard for all shift operations
- **Calendar View**: Visual weekly schedule with print functionality
- **Student Assignment Tracking**: Monitor student assignments and hours

## 🛠 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation
- **Lucide React** for icons

### Backend (MongoDB + Express.js)

- **Node.js** with Express.js
- **MongoDB** for database
- **Mongoose** for ODM
- **JWT** for authentication
- **bcrypt** for password hashing


│   ├── student.js
│   └── admin.js
├── middleware/
│   ├── auth.js
│   └── admin.js
├── config/
│   └── db.js
└── server.js
```


### Next Steps

1. **Set up Express.js server** with MongoDB connection
2. **Implement authentication** with JWT
3. **Create API routes** for all endpoints listed above
4. **Replace mock data** with actual API calls
5. **Add error handling** and validation
6. **Implement real-time updates** (optional: WebSocket)

### Priority API Endpoints

1. **Authentication** (`/api/auth/login`, `/api/auth/signup`)
2. **Student Shift Management** (`/api/student/shifts/*`)
3. **Admin Shift Management** (`/api/admin/shifts/*`)
4. **Attendance Tracking** (`/api/student/attendance`, `/api/admin/attendance`)

## 🎯 Key Features Implemented

### Student Dashboard

- ✅ Browse available shifts by location
- ✅ Claim shifts instantly
- ✅ View current and past shifts
- ✅ Track weekend shift compliance
- ✅ Calculate estimated pay

### Admin Dashboard

- ✅ Create new shifts (one-time and recurring)
- ✅ Manage shift status (active/inactive/cancelled)
- ✅ View all shifts with filtering
- ✅ Calendar view with print functionality
- ✅ Student assignment tracking

### Authentication

- ✅ Email-based login (replaced Student ID)
- ✅ Signup with role selection
- ✅ Session management with localStorage

## 🔒 Security Considerations

- **Password hashing** with bcrypt
- **JWT token** authentication
- **Role-based access** control
- **Input validation** and sanitization
- **CORS** configuration for frontend-backend communication

## 📊 Performance Optimizations

- **React.memo** for component optimization
- **Lazy loading** for routes
- **Debounced search** functionality
- **Pagination** for large datasets (future)
- **Caching** strategies (future)

---

**Note**: This system is designed to replace the traditional request/approval workflow with a direct shift claiming system, making it more efficient for both students and administrators.
**Future**: Add google calender for users side
