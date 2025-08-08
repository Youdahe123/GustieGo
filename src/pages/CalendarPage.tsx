import React from 'react';
import CalendarComponent from '@/components/Calendar';

// Sample data for the calendar
const sampleRequests = [
  {
    id: '1',
    studentId: '1100830',
    location: 'Kitchen',
    day: 'Monday',
    shiftType: 'weekday' as const,
    timeSlot: '7:00-11:00 AM',
    hoursPerWeek: 4,
    status: 'approved' as const,
    requestedAt: '2024-07-09 14:30',
    isInternational: true
  },
  {
    id: '2',
    studentId: '1100831',
    location: 'Salad',
    day: 'Saturday',
    shiftType: 'weekend' as const,
    timeSlot: '12:00-4:00 PM',
    hoursPerWeek: 4,
    status: 'approved' as const,
    requestedAt: '2024-07-09 15:45'
  },
  {
    id: '3',
    studentId: '1100832',
    location: 'Pizza',
    day: 'Friday',
    shiftType: 'weekday' as const,
    timeSlot: '3:00-7:00 PM',
    hoursPerWeek: 4,
    status: 'approved' as const,
    requestedAt: '2024-07-09 16:20'
  },
  {
    id: '4',
    studentId: '1100830',
    location: 'Courtyard',
    day: 'Sunday',
    shiftType: 'weekend' as const,
    timeSlot: '10:00 AM-2:00 PM',
    hoursPerWeek: 4,
    status: 'approved' as const,
    requestedAt: '2024-07-09 17:10',
    isInternational: true
  },
  {
    id: '5',
    studentId: '1100833',
    location: 'Dishroom',
    day: 'Tuesday',
    shiftType: 'weekday' as const,
    timeSlot: '7:00-11:00 PM',
    hoursPerWeek: 4,
    status: 'approved' as const,
    requestedAt: '2024-07-09 18:00',
    isAbsence: true
  },
  {
    id: '6',
    studentId: '1100834',
    location: 'Bakery',
    day: 'Wednesday',
    shiftType: 'weekday' as const,
    timeSlot: '6:00-10:00 AM',
    hoursPerWeek: 4,
    status: 'approved' as const,
    requestedAt: '2024-07-09 19:00'
  },
  {
    id: '7',
    studentId: '1100835',
    location: 'Wok',
    day: 'Thursday',
    shiftType: 'weekday' as const,
    timeSlot: '4:00-8:00 PM',
    hoursPerWeek: 4,
    status: 'approved' as const,
    requestedAt: '2024-07-09 20:00',
    isInternational: true
  }
];

const CalendarPage = () => {
  return <CalendarComponent requests={sampleRequests} />;
};

export default CalendarPage; 