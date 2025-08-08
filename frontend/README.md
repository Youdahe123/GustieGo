# GustieGo Frontend

A modern React TypeScript frontend for the GustieGo shift management system.

## Features

### 🎯 **Student Features**

- **Dashboard**: View available shifts and claimed shifts
- **Claim Shifts**: Easily claim available shifts
- **Give Away Shifts**: Transfer shifts to other students
- **Mark Absence**: Report when you can't attend a shift
- **Calendar View**: Visual calendar of all shifts

### 👨‍💼 **Admin Features**

- **Admin Dashboard**: System overview with statistics
- **Shift Management**: Create, edit, and delete shifts
- **Analytics**: Comprehensive student performance analytics
- **Calendar Management**: Visual shift scheduling

### 🔐 **Authentication**

- Secure login/register system
- Role-based access control (Student/Admin)
- JWT token authentication
- Protected routes

## Tech Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **React Router** for navigation
- **Axios** for API communication
- **Recharts** for data visualization
- **Date-fns** for date manipulation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:3001`

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with navigation
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── pages/              # Page components
│   ├── Login.tsx       # Login/Register page
│   ├── Dashboard.tsx   # Student dashboard
│   ├── AdminDashboard.tsx # Admin dashboard
│   ├── ShiftManagement.tsx # Shift management
│   ├── Analytics.tsx   # Analytics dashboard
│   └── Calendar.tsx    # Calendar view
├── services/           # API services
│   └── api.ts         # Axios configuration
└── types/              # TypeScript type definitions
```

## API Integration

The frontend connects to your GustieGo backend API with the following endpoints:

### Authentication

- `POST /user/login` - User login
- `POST /user/register` - User registration

### Shifts

- `GET /shift/available` - Get available shifts
- `POST /shift/makeShift` - Create new shift (admin)
- `PUT /shift/claimShift` - Claim a shift
- `PUT /shift/giveAway` - Give away a shift
- `PUT /shift/absence` - Mark absence
- `DELETE /shift/delete` - Delete shift (admin)

### Analytics

- `GET /analytics/student/:id` - Get student analytics

## Key Features

### 🔄 **Real-time Updates**

- Automatic refresh of shift data
- Live status updates
- Real-time notifications

### 📊 **Data Visualization**

- Interactive charts and graphs
- Student performance analytics
- Shift distribution visualization

### 📱 **Responsive Design**

- Mobile-friendly interface
- Touch-optimized controls
- Adaptive layout

### 🎨 **Modern UI/UX**

- Material Design principles
- Intuitive navigation
- Consistent styling
- Accessibility features

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001
```

## Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

### Deploy to Production

1. Build the project: `npm run build`
2. Serve the `build/` directory with your web server
3. Ensure your backend API is accessible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support, email: youdaheasfaw@gmail.com

## License

This project is licensed under the MIT License.
