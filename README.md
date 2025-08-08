# 🚍 GustieGo - Fullstack Shift Management System

A complete shift management system for Gustavus Adolphus College cafeteria, built with **React + TypeScript** frontend and **Node.js + Express + MongoDB** backend.

## 🚀 Features

### 👨‍🎓 Student Features

- **Browse Available Shifts**: View all available shifts by location and time
- **Claim Shifts**: Instantly claim available shifts with one click
- **Give Away Shifts**: Transfer claimed shifts to other students
- **Mark Absence**: Report when you can't attend a shift
- **View Current & Past Shifts**: Track your shift history and current assignments
- **Calendar View**: Visual weekly schedule of all shifts

### 👨‍💼 Admin Features

- **Create New Shifts**: Add shifts with custom time slots and locations
- **Manage Shift Status**: Activate, deactivate, or delete shifts
- **Central Shift Management**: Comprehensive dashboard for all shift operations
- **Analytics Dashboard**: Student performance and attendance tracking
- **Calendar Management**: Visual shift scheduling and overview

### 🔐 Authentication

- **Secure Login/Register**: JWT-based authentication
- **Role-based Access**: Student vs Admin permissions
- **Session Management**: Persistent login with localStorage

## 🛠 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **React Router** for navigation
- **Axios** for API communication
- **Recharts** for data visualization
- **Date-fns** for date manipulation

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled for frontend communication

## 📁 Project Structure

```
GustieGoAPI/
├── backend/
│   ├── app.js                 # Main server file
│   ├── db/
│   │   └── db.js             # MongoDB connection
│   ├── middleware/
│   │   └── adminAuth.js      # Authentication middleware
│   ├── models/
│   │   ├── auth.js           # User model
│   │   └── shifts.js         # Shift model
│   ├── routes/
│   │   ├── analytics.js      # Analytics endpoints
│   │   ├── calender.js       # Calendar endpoints
│   │   ├── info.js           # Info endpoints
│   │   ├── shift.js          # Shift management
│   │   └── user.js           # User authentication
│   └── services/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── types/            # TypeScript types
│   └── public/
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB installed and running
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm start
```

Backend will run on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run on `http://localhost:3001`

## 📊 API Endpoints

### Authentication

- `POST /users/register` - User registration
- `POST /users/login` - User login

### Shift Management

- `POST /shift/makeShift` - Create new shift (admin)
- `GET /shift/available` - Get available shifts
- `PUT /shift/claimShift` - Claim a shift
- `PUT /shift/giveAway` - Give away a shift
- `PUT /shift/absence` - Mark absence
- `DELETE /shift/delete` - Delete shift (admin)

### Analytics

- `GET /analytics/student/:id` - Get student analytics

## 🎯 Key Features Implemented

### ✅ Student Dashboard

- Browse available shifts by location
- Claim shifts instantly
- Give away shifts to other students
- Mark absence for claimed shifts
- View personal shift calendar

### ✅ Admin Dashboard

- Create new shifts with time selection
- Manage shift status and deletion
- View all shifts with filtering
- Analytics dashboard with charts
- Calendar view for shift management

### ✅ Authentication System

- Secure login/register with role selection
- JWT token-based authentication
- Protected routes for admin functions
- Session persistence

## 🔒 Security Features

- **Password hashing** with bcrypt
- **JWT token** authentication
- **Role-based access** control (Student/Admin)
- **Input validation** and sanitization
- **CORS** configuration for frontend-backend communication

## 📱 User Interface

### Modern Design

- **Material-UI** components for consistent design
- **Responsive layout** that works on desktop and mobile
- **Intuitive navigation** with sidebar menu
- **Real-time updates** for shift status changes

### Data Visualization

- **Interactive charts** for analytics
- **Calendar view** for shift scheduling
- **Progress indicators** for loading states
- **Error handling** with user-friendly messages

## 🚀 Deployment

### Backend Deployment

1. Set up MongoDB database
2. Configure environment variables
3. Deploy to Railway/Render/Fly.io
4. Set up CORS for frontend domain

### Frontend Deployment

1. Build the project: `npm run build`
2. Deploy to Vercel/Netlify/GitHub Pages
3. Configure API base URL for production

## 🔧 Development

### Available Scripts

**Backend:**

- `npm start` - Start development server
- `npm run dev` - Start with nodemon (if configured)

**Frontend:**

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## 🧪 Future Enhancements

- **Real-time notifications** with WebSocket
- **Email/SMS alerts** for shift reminders
- **Google Calendar integration**
- **Mobile app** with React Native
- **Advanced analytics** with machine learning
- **Multi-campus support**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support, email: youdaheasfaw@gmail.com

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the Gustavus Adolphus College community**
