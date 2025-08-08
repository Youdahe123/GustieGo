# 🚍 GustieGo API

The **GustieGo API** is the backend engine behind the GustieGo platform — a student-focused shift scheduling and ride-sharing system built for the Gustavus Adolphus College community.

Built with modular microservices and a clean API-first design, it handles user authentication, shift coordination, time tracking, and smart notifications.

---

## 📦 Overview

| Service                 | Description                                                |
| ----------------------- | ---------------------------------------------------------- |
| 👤 User Service         | Manages accounts, logins, and permissions                  |
| 📅 Shift Service        | Core logic for Caf shift creation, claiming, and giveaways |
| 💰 Time & Pay Service   | Tracks hours worked and calculates estimated payroll       |
| 🔔 Notification Service | Sends email/SMS alerts for shift events and warnings       |
| 🛡️ Security Layer       | Auth middleware and permission control                     |
| 📊 Analytics Service    | (Optional) Tracks trends like shift coverage and no-shows  |

---

## 🧍‍♂️ 1. User Service

Handles student/admin profiles, login, and permissions.

### Endpoints

- `POST /signup`
- `POST /login`
- `GET /users/{id}`
- `PATCH /users/{id}`

### Responsibilities

- JWT authentication & refresh logic
- Role management: student vs admin
- Password hashing with bcrypt
- Middleware for secure route access

---

## 📅 2. Shift Service

The core of the platform — manages Caf shifts.

### Endpoints

- `POST /shifts` (admin only)
- `GET /shifts/available`
- `POST /shifts/claim`
- `POST /shifts/giveaway`
- `PATCH /shifts/{id}/status`

### Responsibilities

- Recurring shift schedule generation
- Track shift claims/giveaways
- Verify users via internal User Service
- Record attendance: `attended`, `missed`, `given_away`

---

## 💰 3. Time & Pay Service

Tracks student hours and calculates estimated pay.

### Endpoints

- `GET /payroll/{user_id}`
- `GET /hours/{user_id}`

### Responsibilities

- Aggregates data from Shift Service
- Calculates total weekly hours/pay
- Flags students nearing 20-hour work limit
- Admin dashboard for full payroll logs

---

## 🔔 4. Notification Service

Handles system alerts and reminders.

### Triggers

- Shift claimed/dropped
- Weekly hour warning
- Upcoming shift reminders

### Channels

- Email (SendGrid / SES)
- Optional: SMS or push (Twilio / Firebase)

### Responsibilities

- Listens to events across services
- Sends batch or real-time notifications

---

## 🛡️ 5. Security Layer

(Can be part of User Service)

### Responsibilities

- Middleware for protected routes
- Token validation & refresh
- Role-based access (e.g., admin-only for shift creation)
- Prevent cross-user data exposure

---

## 📊 6. Analytics Service (Optional, Post-MVP)

Provides insights into platform usage.

### Responsibilities

- Shift coverage and attendance trends
- Busiest times, most missed shifts
- Future integration with admin dashboards

---

## 🗄️ Database Design

(MongoDB for MVP, PostgreSQL optional)

```bash
users (
  id, name, email, role, password_hash
)

shifts (
  id, datetime, status, student_id, created_by, is_recurring
)

assignments (
  shift_id, student_id, claimed_at
)

payroll_logs (
  user_id, week_start, total_hours, estimated_pay
)
```

---

## 🚀 Tech Stack

| Layer             | Tech                           |
| ----------------- | ------------------------------ |
| **Backend**       | Node.js + Express              |
| **Frontend**      | React + TypeScript             |
| **Database**      | MongoDB                        |
| **Auth**          | JWT + bcrypt                   |
| **Notifications** | SendGrid, SES, Twilio/Firebase |
| **Hosting**       | Railway / Render / Fly.io      |

---

## 🎯 Frontend Features

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

---

## 🧪 Future Improvements

- Admin analytics dashboard
- SMS/push notifications
- GraphQL API gateway
- PostgreSQL migration with Prisma
- Google Calendar integration

---

## 🧠 Contributing

Interested in helping build GustieGo?  
Open an issue, fork the repo, and get in touch!

// ===============================
// TODOs & NOTES FOR SHIFT ROUTES
// ===============================

// --- /makeShift Endpoint ---
// - Consider validating that Time is in the correct format ("HH:MM AM/PM - HH:MM AM/PM").
// - In the future, parse startTime and endTime as Date objects for easier automation (currently stored as strings).
// - Add input validation for required fields (location, dayOfWeek, hoursPerShift, etc).
// - Optionally, allow admin to specify weekOf, or always auto-calculate (currently auto-calculated).
// - If supporting recurring shifts, implement logic to auto-generate future shifts based on recurringPattern.

// --- /claimShift Endpoint ---
// - Prevent duplicate claims by the same user for the same shift.
// - Consider checking if the shift is still active before allowing claim.

// --- /giveAway Endpoint ---
// - Add edge case handling for one-time shifts (non-recurring).
// - Ensure the target student is eligible to take the shift (not already assigned).
// - Optionally, notify both students when a shift is given away.

// --- /absence Endpoint ---
// - Consider logging absences for analytics.
// - Optionally, allow admin override for marking absent.

// --- General Improvements ---
// - Add more robust error handling and logging.
// - Implement input validation middleware for all endpoints.
// - Add unit tests for all shift routes.
// - Consider using startTime/endTime as Date objects for automation (e.g., automatic completion).
// - Implement scheduled job (cron) for weekly analytics aggregation and shift resets.
// - Document all endpoints and expected request/response formats.

// --- Analytics ---
