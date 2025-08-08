import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add, Person, Schedule, LocationOn } from '@mui/icons-material';
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

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
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
  };

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