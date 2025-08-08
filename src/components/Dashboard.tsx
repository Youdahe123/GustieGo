
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { LogOut, Coffee, Clock, DollarSign, AlertTriangle, CheckCircle, Trash2, AlertCircle } from 'lucide-react';
// TODO: Replace with actual API calls
// import { getAvailableShifts, claimShift } from '../lib/api';

interface LocationShift {
  id: string;
  location: string;
  day: string;
  timeSlot: string;
  hoursPerShift: number;
  maxWorkers: number;
  currentWorkers: number;
  status: 'available' | 'requested' | 'assigned' | 'full';
}

interface DashboardProps {
  studentId: string;
  onLogout: () => void;
}

const Dashboard = ({ studentId, onLogout }: DashboardProps) => {
  const locations = ['Kitchen', 'Salad', 'Bakery', 'Wok', 'Pizza', 'Grill', 'Deli', 'Cashier', 'Rotisserie', 'Dishroom', 'Lunch Buffet', 'Courtyard', 'STEAMery'];
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [transferTarget, setTransferTarget] = useState('');
  const [absenceTarget, setAbsenceTarget] = useState('');
  const [shiftToRemove, setShiftToRemove] = useState<string | null>(null);
  const [isRemovalDialogOpen, setIsRemovalDialogOpen] = useState(false);
  const [isAbsenceDialogOpen, setIsAbsenceDialogOpen] = useState(false);
  
  const [weekdayShifts, setWeekdayShifts] = useState<LocationShift[]>([
    { id: 'w1', location: 'Kitchen', day: 'Monday', timeSlot: '7:00-11:00 AM', hoursPerShift: 4, maxWorkers: 3, currentWorkers: 1, status: 'available' },
    { id: 'w2', location: 'Kitchen', day: 'Tuesday', timeSlot: '7:00-11:00 AM', hoursPerShift: 4, maxWorkers: 3, currentWorkers: 2, status: 'available' },
    { id: 'w3', location: 'Salad', day: 'Monday', timeSlot: '11:00 AM-3:00 PM', hoursPerShift: 4, maxWorkers: 2, currentWorkers: 0, status: 'available' },
    { id: 'w4', location: 'Salad', day: 'Wednesday', timeSlot: '11:00 AM-3:00 PM', hoursPerShift: 4, maxWorkers: 2, currentWorkers: 1, status: 'available' },
    { id: 'w5', location: 'Pizza', day: 'Friday', timeSlot: '3:00-7:00 PM', hoursPerShift: 4, maxWorkers: 2, currentWorkers: 2, status: 'full' },
    { id: 'w6', location: 'Grill', day: 'Thursday', timeSlot: '7:00-11:00 AM', hoursPerShift: 4, maxWorkers: 2, currentWorkers: 0, status: 'available' },
    { id: 'w7', location: 'Cashier', day: 'Tuesday', timeSlot: '11:00 AM-3:00 PM', hoursPerShift: 4, maxWorkers: 4, currentWorkers: 2, status: 'requested' },
    { id: 'w8', location: 'Dishroom', day: 'Monday', timeSlot: '7:00-11:00 PM', hoursPerShift: 4, maxWorkers: 3, currentWorkers: 1, status: 'assigned' }
  ]);

  const [weekendShifts, setWeekendShifts] = useState<LocationShift[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // API Endpoint: GET /available
    // async function fetchWeekendShifts() {
    //   try {
    //     const response = await fetch('/available');
    //     const data = await response.json();
    //     setWeekendShifts(data);
    //   } catch (error) {
    //     toast({
    //       title: 'Error',
    //       description: 'Failed to fetch weekend shifts from backend.',
    //       variant: 'destructive',
    //     });
    //   }
    // }
    // fetchWeekendShifts();
    
    // Dummy data for weekend shifts
    const dummyWeekendShifts: LocationShift[] = [
      {
        id: 'w1',
        location: 'Kitchen',
        day: 'Saturday',
        timeSlot: '8:00-12:00 PM',
        hoursPerShift: 4,
        maxWorkers: 2,
        currentWorkers: 1,
        status: 'available' as const
      },
      {
        id: 'w2',
        location: 'Salad',
        day: 'Sunday',
        timeSlot: '10:00 AM-2:00 PM',
        hoursPerShift: 4,
        maxWorkers: 2,
        currentWorkers: 0,
        status: 'available' as const
      }
    ];
    setWeekendShifts(dummyWeekendShifts);
  }, []);

  const handleRequestShift = async (shiftId: string, isWeekend: boolean) => {
    // TODO: Replace with actual API call
    // API Endpoint: PUT /claimShift
    // try {
    //   const response = await fetch('/claimShift', {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ shiftId })
    //   });
    //   const data = await response.json();
    //   if (data.success) {
    //     if (isWeekend) {
    //       setWeekendShifts(prevShifts =>
    //         prevShifts.map(shift =>
    //           shift.id === shiftId
    //             ? { ...shift, status: 'requested' as const }
    //             : shift
    //         )
    //       );
    //     } else {
    //       setWeekdayShifts(prevShifts =>
    //         prevShifts.map(shift =>
    //           shift.id === shiftId
    //             ? { ...shift, status: 'requested' as const }
    //             : shift
    //         )
    //       );
    //     }
    //     const allShifts = [...weekdayShifts, ...weekendShifts];
    //     const shift = allShifts.find(s => s.id === shiftId);
    //     toast({
    //       title: 'Shift Request Sent!',
    //       description: `Your request for ${shift?.location} on ${shift?.day} has been submitted.`,
    //     });
    //   } else {
    //     toast({
    //       title: 'Request Failed',
    //       description: data.message || 'Could not request shift.',
    //       variant: 'destructive',
    //     });
    //   }
    // } catch (error) {
    //   toast({
    //     title: 'Error',
    //     description: 'Failed to request shift from backend.',
    //     variant: 'destructive',
    //   });
    // }
    
    // Dummy implementation - simulate successful shift claim
    if (isWeekend) {
      setWeekendShifts(prevShifts =>
        prevShifts.map(shift =>
          shift.id === shiftId
            ? { ...shift, status: 'requested' as const }
            : shift
        )
      );
    } else {
      setWeekdayShifts(prevShifts =>
        prevShifts.map(shift =>
          shift.id === shiftId
            ? { ...shift, status: 'requested' as const }
            : shift
        )
      );
    }
    const allShifts = [...weekdayShifts, ...weekendShifts];
    const shift = allShifts.find(s => s.id === shiftId);
    toast({
      title: 'Shift Claimed!',
      description: `Successfully claimed shift for ${shift?.location} on ${shift?.day}.`,
    });
  };

  const handleTransferShift = () => {
    if (!shiftToRemove || !transferTarget.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter the username of the person you want to transfer this shift to.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Replace with actual API call
    // API Endpoint: PUT /giveAway
    // const response = await fetch('/giveAway', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ shiftId: shiftToRemove, targetStudentId: transferTarget })
    // });
    // const data = await response.json();

    const updateShifts = (shifts: LocationShift[]) =>
      shifts.map(shift =>
        shift.id === shiftToRemove
          ? { ...shift, status: 'available' as const, currentWorkers: shift.currentWorkers - 1 }
          : shift
      );

    setWeekdayShifts(updateShifts);
    setWeekendShifts(updateShifts);

    toast({
      title: "Shift Transferred",
      description: `Shift transferred to ${transferTarget}.`,
    });

    setIsRemovalDialogOpen(false);
    setTransferTarget('');
    setShiftToRemove(null);
  };

  const handleMarkAbsence = () => {
    if (!shiftToRemove || !absenceTarget.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a student username to mark as absent.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Replace with actual API call
    // API Endpoint: PUT /absence
    // const response = await fetch('/absence', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ shiftId: shiftToRemove, studentId: absenceTarget })
    // });
    // const data = await response.json();

    toast({
      title: "Absence Marked",
      description: `Absence logged for ${absenceTarget} on this shift.`,
      variant: "destructive",
    });

    setIsAbsenceDialogOpen(false);
    setAbsenceTarget('');
    setShiftToRemove(null);
  };

  // Filter shifts by location
  const getFilteredShifts = (shifts: LocationShift[]) => {
    if (selectedLocation === 'All Locations') return shifts;
    return shifts.filter(shift => shift.location === selectedLocation);
  };

  // Group shifts by day
  const groupShiftsByDay = (shifts: LocationShift[]) => {
    const grouped = shifts.reduce((acc, shift) => {
      if (!acc[shift.day]) {
        acc[shift.day] = [];
      }
      acc[shift.day].push(shift);
      return acc;
    }, {} as Record<string, LocationShift[]>);
    
    return grouped;
  };

  // Calculate stats
  const assignedShifts = [...weekdayShifts, ...weekendShifts].filter(shift => 
    shift.status === 'requested' || shift.status === 'assigned'
  );
  const totalHours = assignedShifts.reduce((sum, shift) => sum + shift.hoursPerShift, 0);
  const estimatedPay = totalHours * 15;
  const hasWeekendShift = weekendShifts.some(shift => 
    shift.status === 'requested' || shift.status === 'assigned'
  );

  const renderShiftCard = (shift: LocationShift, isWeekend: boolean) => (
    <Card key={shift.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{shift.location}</h3>
            <p className="text-sm text-gray-600">{shift.timeSlot}</p>
            <p className="text-sm font-medium text-green-600">{shift.hoursPerShift} hrs • $15/hr</p>
          </div>
          <Badge
            variant={
              shift.status === 'available' ? 'default' :
              shift.status === 'requested' ? 'secondary' :
              shift.status === 'assigned' ? 'default' :
              'destructive'
            }
            className={
              shift.status === 'available' ? 'bg-green-100 text-green-800' :
              shift.status === 'requested' ? 'bg-blue-100 text-blue-800' :
              shift.status === 'assigned' ? 'bg-purple-100 text-purple-800' :
              'bg-red-100 text-red-800'
            }
          >
            {shift.status === 'available' ? 'Available' :
             shift.status === 'requested' ? 'Requested' :
             shift.status === 'assigned' ? 'Assigned' :
             'Full'}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Workers: {shift.currentWorkers}/{shift.maxWorkers}
          </span>
          
          {shift.status === 'available' ? (
            <Button
              size="sm"
              onClick={() => handleRequestShift(shift.id, isWeekend)}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              Request Shift
            </Button>
          ) : shift.status === 'requested' || shift.status === 'assigned' ? (
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary" disabled>
                <CheckCircle className="w-4 h-4 mr-2" />
                {shift.status === 'requested' ? 'Requested' : 'Assigned'}
              </Button>
              <Dialog open={isRemovalDialogOpen && shiftToRemove === shift.id} onOpenChange={setIsRemovalDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShiftToRemove(shift.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Transfer Shift</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Enter the username of the person you want to transfer this shift to:
                    </p>
                    <Input
                      type="text"
                      placeholder="Enter username"
                      value={transferTarget}
                      onChange={(e) => setTransferTarget(e.target.value)}
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleTransferShift}
                        className="flex-1"
                      >
                        🔄 Transfer Shift
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsRemovalDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAbsenceDialogOpen && shiftToRemove === shift.id} onOpenChange={setIsAbsenceDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => setShiftToRemove(shift.id)}
                  >
                    🚫 Mark Absence
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Mark Absence</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Enter a student username to mark as absent (you can mark yourself):
                    </p>
                    <Input
                      type="text"
                      placeholder="Enter username (or your own)"
                      value={absenceTarget}
                      onChange={(e) => setAbsenceTarget(e.target.value)}
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleMarkAbsence}
                        variant="destructive"
                        className="flex-1"
                      >
                        🚫 Mark Absence
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsAbsenceDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Button size="sm" variant="outline" disabled>
              Full
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderDayGroup = (day: string, shifts: LocationShift[], isWeekend: boolean) => (
    <div key={day} className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">{day}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shifts.map(shift => renderShiftCard(shift, isWeekend))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                className="p-0 h-auto hover:bg-transparent"
                onClick={() => window.location.href = '/'}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-white" />
                </div>
              </Button>
              <Button
                variant="ghost"
                className="p-0 h-auto text-xl font-bold text-gray-800 hover:text-gray-600 hover:bg-transparent"
                onClick={() => window.location.href = '/'}
              >
                GustieGo
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Locations">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">Welcome, {studentId}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-blue-600">{totalHours}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estimated Pay</p>
                  <p className="text-2xl font-bold text-green-600">${estimatedPay}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={`hover:shadow-md transition-shadow ${!hasWeekendShift ? 'border-orange-200 bg-orange-50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Weekend Status</p>
                  <p className={`text-2xl font-bold ${hasWeekendShift ? 'text-green-600' : 'text-orange-600'}`}>
                    {hasWeekendShift ? 'Scheduled' : 'Missing'}
                  </p>
                </div>
                {hasWeekendShift ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekend Alert */}
        {!hasWeekendShift && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <p className="text-orange-800 font-medium">
                  Remember to sign up for at least one weekend shift!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shift Sheets */}
        <Tabs defaultValue="weekday" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekday">Weekday Shifts (Mon-Fri)</TabsTrigger>
            <TabsTrigger value="weekend">Weekend Shifts (Fri 4PM+, Sat-Sun)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekday" className="mt-6">
            <div className="space-y-6">
              {Object.entries(groupShiftsByDay(getFilteredShifts(weekdayShifts))).map(([day, shifts]) =>
                renderDayGroup(day, shifts, false)
              )}
              {Object.keys(groupShiftsByDay(getFilteredShifts(weekdayShifts))).length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No weekday shifts available for {selectedLocation}.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="weekend" className="mt-6">
            <div className="space-y-6">
              {Object.entries(groupShiftsByDay(getFilteredShifts(weekendShifts))).map(([day, shifts]) =>
                renderDayGroup(day, shifts, true)
              )}
              {Object.keys(groupShiftsByDay(getFilteredShifts(weekendShifts))).length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No weekend shifts available for {selectedLocation}.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
