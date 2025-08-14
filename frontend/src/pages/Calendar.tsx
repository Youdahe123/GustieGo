import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Button,
} from '@mui/material';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Schedule, AdminPanelSettings, LocationOn } from '@mui/icons-material';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Shift {
  _id: string;
  location: string;
  dayOfWeek: string;
  Time: string;
  hoursPerShift: number;
  maxWorkers: number;
  currentWorkers: number;
  status: string;
  notes?: string;
}

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate] = useState(new Date());

  useEffect(() => {
    // Only fetch shifts if user is a student
    if (user?.role === 'Student') {
      fetchShifts();
    } else {
      setLoading(false);
    }
  }, [user?.role]);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/shift/available');
      setShifts((response.data as { shifts: Shift[] }).shifts);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch shifts');
    } finally {
      setLoading(false);
    }
  };

  const getShiftsForDay = (dayName: string) => {
    return shifts.filter(shift => shift.dayOfWeek === dayName);
  };

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDaysArray = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Admin Calendar View
  if (user?.role === 'Admin') {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Calendar View
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Admin Calendar
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 2 }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Schedule />}
                    onClick={() => window.location.href = '/shifts'}
                    fullWidth
                  >
                    Manage Shifts
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AdminPanelSettings />}
                    onClick={() => window.location.href = '/admin'}
                    fullWidth
                  >
                    Admin Panel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<LocationOn />}
                    onClick={() => window.location.href = '/analytics'}
                    fullWidth
                  >
                    View Analytics
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Calendar Information
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  As an admin, you can view and manage shifts through the Shift Management page. 
                  The calendar view is primarily designed for students to see their available and scheduled shifts.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    );
  }

  // Student Calendar View
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Calendar View
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Week Navigation */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </Typography>
      </Box>

      {/* Calendar Grid */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {/* Day Headers */}
          {weekDays.map((day) => (
            <Box
              key={day}
              sx={{
                p: 1,
                textAlign: 'center',
                fontWeight: 'bold',
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              {day}
            </Box>
          ))}

          {/* Day Cells */}
          {weekDaysArray.map((date) => {
            const dayName = format(date, 'EEEE');
            const dayShifts = getShiftsForDay(dayName);
            const isToday = isSameDay(date, new Date());

            return (
              <Box
                key={date.toISOString()}
                sx={{
                  minHeight: 120,
                  p: 1,
                  border: '1px solid #e0e0e0',
                  backgroundColor: isToday ? '#f0f8ff' : 'transparent',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isToday ? 'bold' : 'normal',
                    color: isToday ? 'primary.main' : 'text.primary',
                  }}
                >
                  {format(date, 'd')}
                </Typography>
                
                {dayShifts.map((shift) => (
                  <Card
                    key={shift._id}
                    sx={{
                      mt: 1,
                      p: 1,
                      fontSize: '0.75rem',
                      backgroundColor: shift.status === 'active' ? '#e8f5e8' : '#f5f5f5',
                    }}
                  >
                    <Typography variant="caption" display="block" fontWeight="bold">
                      {shift.location}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {shift.Time}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {shift.currentWorkers}/{shift.maxWorkers}
                    </Typography>
                  </Card>
                ))}
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Legend */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Legend
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: '#e8f5e8',
                border: '1px solid #ccc',
              }}
            />
            <Typography variant="body2">Active Shifts</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: '#f5f5f5',
                border: '1px solid #ccc',
              }}
            />
            <Typography variant="body2">Inactive Shifts</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar; 