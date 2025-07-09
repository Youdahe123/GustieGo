
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { LogOut, Coffee, Clock, DollarSign, AlertTriangle, CheckCircle, Trash2, AlertCircle } from 'lucide-react';

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
  const [accessKey, setAccessKey] = useState('');
  const [shiftToRemove, setShiftToRemove] = useState<string | null>(null);
  const [isRemovalDialogOpen, setIsRemovalDialogOpen] = useState(false);
  
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

  const [weekendShifts, setWeekendShifts] = useState<LocationShift[]>([
    { id: 'e1', location: 'Kitchen', day: 'Friday', timeSlot: '4:00-8:00 PM', hoursPerShift: 4, maxWorkers: 2, currentWorkers: 0, status: 'available' },
    { id: 'e2', location: 'Kitchen', day: 'Saturday', timeSlot: '8:00 AM-12:00 PM', hoursPerShift: 4, maxWorkers: 2, currentWorkers: 1, status: 'available' },
    { id: 'e3', location: 'Salad', day: 'Saturday', timeSlot: '12:00-4:00 PM', hoursPerShift: 4, maxWorkers: 2, currentWorkers: 1, status: 'available' },
    { id: 'e4', location: 'Bakery', day: 'Sunday', timeSlot: '6:00-10:00 AM', hoursPerShift: 4, maxWorkers: 1, currentWorkers: 0, status: 'available' },
    { id: 'e5', location: 'Courtyard', day: 'Saturday', timeSlot: '10:00 AM-2:00 PM', hoursPerShift: 4, maxWorkers: 2, currentWorkers: 1, status: 'requested' },
    { id: 'e6', location: 'STEAMery', day: 'Sunday', timeSlot: '2:00-6:00 PM', hoursPerShift: 4, maxWorkers: 1, currentWorkers: 1, status: 'full' }
  ]);

  const handleRequestShift = (shiftId: string, isWeekend: boolean) => {
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
      title: "Shift Request Sent!",
      description: `Your request for ${shift?.location} on ${shift?.day} has been submitted.`,
    });
  };

  const handleRemoveShift = (type: 'remove' | 'absence') => {
    if (accessKey !== 'cafe2024') {
      toast({
        title: "Invalid Access Key",
        description: "Please enter the correct access key provided by café management.",
        variant: "destructive",
      });
      return;
    }

    if (!shiftToRemove) return;

    const updateShifts = (shifts: LocationShift[]) =>
      shifts.map(shift =>
        shift.id === shiftToRemove
          ? { ...shift, status: 'available' as const, currentWorkers: shift.currentWorkers - 1 }
          : shift
      );

    setWeekdayShifts(updateShifts);
    setWeekendShifts(updateShifts);

    toast({
      title: type === 'remove' ? "Shift Removed" : "Absence Marked",
      description: type === 'remove' 
        ? "Your shift has been removed and made available for others."
        : "Your absence has been logged and will be reviewed by management.",
      variant: type === 'absence' ? "destructive" : "default",
    });

    setIsRemovalDialogOpen(false);
    setAccessKey('');
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
                    <DialogTitle>Remove Shift</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Enter the access key provided by café management to remove this shift:
                    </p>
                    <Input
                      type="password"
                      placeholder="Access key"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleRemoveShift('remove')}
                        className="flex-1"
                      >
                        ❌ Remove Shift
                      </Button>
                      <Button
                        onClick={() => handleRemoveShift('absence')}
                        variant="destructive"
                        className="flex-1"
                      >
                        🚫 Mark Absence
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Coffee className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">GustieGo</h1>
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
