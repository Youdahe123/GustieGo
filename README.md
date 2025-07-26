# GustieGo - Cafeteria Shift Management System

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

## 📁 Project Structure

```
frontend/cafeteria-shift-buddy/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # Student dashboard (shift claiming)
│   │   ├── AdminDashboard.tsx     # Admin dashboard (shift management)
│   │   ├── Calendar.tsx           # Calendar view component
│   │   ├── LoginForm.tsx          # Login form
│   │   ├── SignupForm.tsx         # Signup form
│   │   └── ui/                    # Shadcn/ui components
│   ├── pages/
│   │   ├── Index.tsx              # Main app router
│   │   ├── SignupPage.tsx         # Signup page
│   │   ├── CalendarPage.tsx       # Standalone calendar
│   │   └── NotFound.tsx           # 404 page
│   ├── hooks/
│   │   └── use-toast.ts           # Toast notifications
│   └── lib/
│       └── utils.ts               # Utility functions
```

## 🔌 API Integration Points

### 🕒 GustieGo Shift Routes

```javascript
// 1. POST /makeShift – Admin creates a new shift
const createShift = async (shiftData: {
  location: string,
  day: string,
  timeSlot: string,
  hoursPerShift: number,
  maxWorkers: number,
  isRecurring: boolean,
  recurringPattern?: string,
  notes?: string,
}) => {
  const response = await fetch("/makeShift", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(shiftData),
  });
  return response.json();
};

// 2. PUT /claimShift – Student claims a shift
const claimShift = async (shiftId: string) => {
  const response = await fetch("/claimShift", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shiftId }),
  });
  return response.json();
};

// 3. PUT /giveAway – Student gives away a shift to another student
const giveAwayShift = async (shiftId: string, targetStudentId: string) => {
  const response = await fetch("/giveAway", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shiftId, targetStudentId }),
  });
  return response.json();
};

// 4. GET /available – Get all available (untaken) shifts
const getAvailableShifts = async () => {
  const response = await fetch("/available");
  return response.json();
};

// 5. PUT /absence – Mark student as absent and free up shift
const markAbsence = async (shiftId: string, studentId: string) => {
  const response = await fetch("/absence", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shiftId, studentId }),
  });
  return response.json();
};
```

### 🔐 Auth Routes

```javascript
// 1. POST /auth/register – register a new user
const registerUser = async (userData: {
  name: string,
  email: string,
  password: string,
  role: "Student" | "Admin",
}) => {
  const response = await fetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// 2. POST /auth/login – log in and return token
const loginUser = async (email: string, password: string) => {
  const response = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};
```

### 📊 Analytics Routes

```javascript
// 3. GET /analytics/student/:id – get student info by ID (admin only)
const getStudentAnalytics = async (studentId: string) => {
  const response = await fetch(`/analytics/student/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};
```

### 📝 Missing APIs (Used in Frontend but Not Provided)

The following APIs are referenced in the frontend code but not included in my APIs . need to implement these or modify the frontend to use existing endpoints:

```javascript
// Used in AdminDashboard.tsx - Update shift status
// PUT /makeShift/{shiftId} - Update existing shift (alternative to separate status endpoint)

// Used in AdminDashboard.tsx - Delete shift
// DELETE /makeShift/{shiftId} - Delete shift (alternative to separate delete endpoint)

// Used in Dashboard.tsx - Get student's claimed shifts
// GET /student/shifts - Get current student's claimed shifts (not provided)

// Used in Dashboard.tsx - Get attendance status
// GET /student/attendance - Get student's attendance record (not provided)
```

## 🗄 Database Schema (MongoDB)

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // hashed with bcrypt
  role: String, // "Student" or "Admin"
  studentId: String, // for students only
  isInternational: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Shifts Collection

```javascript
{
  _id: ObjectId,
  location: String,
  day: String, // "Monday", "Tuesday", etc.
  timeSlot: String, // "7:00-11:00 AM"
  hoursPerShift: Number,
  maxWorkers: Number,
  currentWorkers: Number,
  status: String, // "active", "inactive", "cancelled"
  assignedStudents: [String], // array of student IDs
  isRecurring: Boolean,
  recurringPattern: String, // "weekly", "biweekly", "monthly"
  createdAt: Date,
  updatedAt: Date
}
```

### ShiftClaims Collection

```javascript
{
  _id: ObjectId,
  shiftId: ObjectId, // reference to shifts collection
  studentId: String,
  status: String, // "claimed", "completed", "cancelled"
  claimedAt: Date,
  completedAt: Date,
  notes: String
}
```

### Attendance Collection

```javascript
{
  _id: ObjectId,
  shiftId: ObjectId,
  studentId: String,
  date: Date,
  status: String, // "present", "absent", "late"
  checkInTime: Date,
  checkOutTime: Date,
  notes: String
}
```

## 🔧 Development Setup

### Frontend Setup

```bash
cd frontend/cafeteria-shift-buddy
npm install
npm run dev
```

### Backend Setup (Express.js + MongoDB)

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize package.json
npm init -y

# Install dependencies
npm install express mongoose bcryptjs jsonwebtoken cors dotenv

# Install dev dependencies
npm install --save-dev nodemon @types/node

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/gustiego
JWT_SECRET=your-secret-key
PORT=3001" > .env
```

### Backend Structure

```
backend/
├── models/
│   ├── User.js
│   ├── Shift.js
│   ├── ShiftClaim.js
│   └── Attendance.js
├── routes/
│   ├── auth.js
│   ├── student.js
│   └── admin.js
├── middleware/
│   ├── auth.js
│   └── admin.js
├── config/
│   └── db.js
└── server.js
```

## 🚀 Deployment

### Frontend Deployment

```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend Deployment

```bash
# Set production environment variables
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-secret

# Start server
npm start
```

## 📝 TODO: API Integration

### Current Status

- ✅ Frontend components completed
- ✅ UI/UX design implemented
- ✅ Mock data and functionality
- 🔄 **Backend API integration pending**

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
