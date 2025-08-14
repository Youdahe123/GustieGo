import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add, Schedule, LocationOn, AdminPanelSettings } from '@mui/icons-material';
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
  assignedStudents?: string[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [availableShifts, setAvailableShifts] = useState<Shift[]>([]);
  const [claimedShifts, setClaimedShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [giveAwayDialog, setGiveAwayDialog] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [targetUsername, setTargetUsername] = useState('');

  const fetchShifts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/shift/available');
      const shiftsData = (response.data as { shifts: Shift[] }).shifts;
      setAvailableShifts(shiftsData);
      
      // Filter claimed shifts (shifts where current user is assigned)
      const userShifts = shiftsData.filter((shift: Shift) =>
        shift.assignedStudents?.includes(user?.id || '')
      );
      setClaimedShifts(userShifts);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch shifts');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    // Only fetch shifts if user is a student
    if (user?.role === 'Student') {
      fetchShifts();
    } else {
      setLoading(false);
    }
  }, [user?.role, fetchShifts]);

  const handleClaimShift = async (shiftId: string) => {
    try {
      await api.put('/shift/claimShift', { shiftId });
      await fetchShifts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to claim shift');
    }
  };

  const handleGiveAway = async () => {
    if (!selectedShift || !targetUsername) return;
    
    try {
      await api.put('/shift/giveAway', {
        shiftId: selectedShift._id,
        targetStudentUsername: targetUsername,
      });
      setGiveAwayDialog(false);
      setSelectedShift(null);
      setTargetUsername('');
      await fetchShifts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to give away shift');
    }
  };

  const handleAbsence = async (shiftId: string) => {
    try {
      await api.put('/shift/absence', { shiftId });
      await fetchShifts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark absence');
    }
  };

  // Admin Dashboard View
  if (user?.role === 'Admin') {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Admin Dashboard
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
                  System Overview
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Use the navigation menu to access administrative functions including shift management, 
                  user administration, and system analytics.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    );
  }

  // Student Dashboard View
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
        Welcome, {user?.name}!
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Available Shifts */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Shifts
              </Typography>
              {availableShifts.length === 0 ? (
                <Typography color="textSecondary">No available shifts</Typography>
              ) : (
                availableShifts.map((shift) => (
                  <Card key={shift._id} sx={{ mb: 2, p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6">{shift.location}</Typography>
                        <Typography color="textSecondary">
                          {shift.dayOfWeek} • {shift.Time}
                        </Typography>
                        <Typography variant="body2">
                          {shift.currentWorkers}/{shift.maxWorkers} workers
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleClaimShift(shift._id)}
                        disabled={shift.currentWorkers >= shift.maxWorkers}
                      >
                        Claim
                      </Button>
                    </Box>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Claimed Shifts */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Shifts
              </Typography>
              {claimedShifts.length === 0 ? (
                <Typography color="textSecondary">No claimed shifts</Typography>
              ) : (
                claimedShifts.map((shift) => (
                  <Card key={shift._id} sx={{ mb: 2, p: 2 }}>
                    <Box>
                      <Typography variant="h6">{shift.location}</Typography>
                      <Typography color="textSecondary">
                        {shift.dayOfWeek} • {shift.Time}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedShift(shift);
                            setGiveAwayDialog(true);
                          }}
                          sx={{ mr: 1 }}
                        >
                          Give Away
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleAbsence(shift._id)}
                        >
                          Mark Absent
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Give Away Dialog */}
      <Dialog open={giveAwayDialog} onClose={() => setGiveAwayDialog(false)}>
        <DialogTitle>Give Away Shift</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Target Username"
            fullWidth
            value={targetUsername}
            onChange={(e) => setTargetUsername(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGiveAwayDialog(false)}>Cancel</Button>
          <Button onClick={handleGiveAway} variant="contained">
            Give Away
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 