
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { LogOut, Coffee, Clock, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

interface LocationShift {
  id: string;
  location: string;
  timeSlot: string;
  hoursPerShift: number;
  maxWorkers: number;
  currentWorkers: number;
  status: 'available' | 'requested' | 'full';
}

interface DashboardProps {
  studentId: string;
  onLogout: () => void;
}

const Dashboard = ({ studentId, onLogout }: DashboardProps) => {
  const locations = ['Kitchen', 'Salad', 'Bakery', 'Wok', 'Pizza', 'Grill', 'Deli', 'Cashier', 'Rotisserie', 'Dishroom', 'Lunch Buffet', 'Courtyard', 'STEAMery'];
  
  const [weekdayShifts, setWeekdayShifts] = useState<LocationShift[]>([
    { id: 'w1', location: 'Kitchen', timeSlot: 'Mon-Fri 7:00-11:00 AM', hoursPerShift: 20, maxWorkers: 3, currentWorkers: 1, status: 'available' },
    { id: 'w2', location: 'Salad', timeSlot: 'Mon-Fri 11:00 AM-3:00 PM', hoursPerShift: 20, maxWorkers: 2, currentWorkers: 0, status: 'available' },
    { id: 'w3', location: 'Pizza', timeSlot: 'Mon-Fri 3:00-7:00 PM', hoursPerShift: 20, maxWorkers: 2, currentWorkers: 2, status: 'full' },
    { id: 'w4', location: 'Grill', timeSlot: 'Mon-Fri 7:00-11:00 AM', hoursPerShift: 20, maxWorkers: 2, currentWorkers: 0, status: 'available' },
    { id: 'w5', location: 'Cashier', timeSlot: 'Mon-Fri 11:00 AM-3:00 PM', hoursPerShift: 20, maxWorkers: 4, currentWorkers: 2, status: 'available' },
    { id: 'w6', location: 'Dishroom', timeSlot: 'Mon-Fri 7:00-11:00 PM', hoursPerShift: 20, maxWorkers: 3, currentWorkers: 1, status: 'available' }
  ]);

  const [weekendShifts, setWeekendShifts] = useState<LocationShift[]>([
    { id: 'e1', location: 'Kitchen', timeSlot: 'Fri 4:00 PM-8:00 PM, Sat-Sun 8:00 AM-12:00 PM', hoursPerShift: 12, maxWorkers: 2, currentWorkers: 0, status: 'available' },
    { id: 'e2', location: 'Salad', timeSlot: 'Sat-Sun 12:00-4:00 PM', hoursPerShift: 8, maxWorkers: 2, currentWorkers: 1, status: 'available' },
    { id: 'e3', location: 'Bakery', timeSlot: 'Sat-Sun 6:00-10:00 AM', hoursPerShift: 8, maxWorkers: 1, currentWorkers: 0, status: 'available' },
    { id: 'e4', location: 'Courtyard', timeSlot: 'Fri 4:00 PM-8:00 PM, Sat-Sun 10:00 AM-2:00 PM', hoursPerShift: 12, maxWorkers: 2, currentWorkers: 1, status: 'available' },
    { id: 'e5', location: 'STEAMery', timeSlot: 'Sat-Sun 2:00-6:00 PM', hoursPerShift: 8, maxWorkers: 1, currentWorkers: 1, status: 'full' }
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
      description: `Your request for ${shift?.location} has been submitted.`,
    });
  };

  // Calculate stats
  const requestedWeekdayShifts = weekdayShifts.filter(shift => shift.status === 'requested');
  const requestedWeekendShifts = weekendShifts.filter(shift => shift.status === 'requested');
  const totalHours = requestedWeekdayShifts.reduce((sum, shift) => sum + shift.hoursPerShift, 0) + 
                    requestedWeekendShifts.reduce((sum, shift) => sum + shift.hoursPerShift, 0);
  const estimatedPay = totalHours * 15;
  const hasWeekendShift = requestedWeekendShifts.length > 0;

  const renderShiftCard = (shift: LocationShift, isWeekend: boolean) => (
    <Card key={shift.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{shift.location}</h3>
            <p className="text-sm text-gray-600">{shift.timeSlot}</p>
            <p className="text-sm font-medium text-green-600">{shift.hoursPerShift} hrs/week • $15/hr</p>
          </div>
          <Badge
            variant={
              shift.status === 'available' ? 'default' :
              shift.status === 'requested' ? 'secondary' :
              'destructive'
            }
            className={
              shift.status === 'available' ? 'bg-green-100 text-green-800' :
              shift.status === 'requested' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }
          >
            {shift.status === 'available' ? 'Available' :
             shift.status === 'requested' ? 'Requested' :
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
          ) : shift.status === 'requested' ? (
            <Button size="sm" variant="secondary" disabled>
              <CheckCircle className="w-4 h-4 mr-2" />
              Requested
            </Button>
          ) : (
            <Button size="sm" variant="outline" disabled>
              Full
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weekdayShifts.map(shift => renderShiftCard(shift, false))}
            </div>
          </TabsContent>
          
          <TabsContent value="weekend" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weekendShifts.map(shift => renderShiftCard(shift, true))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
