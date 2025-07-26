import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Printer, ChevronLeft, ChevronRight, Coffee } from 'lucide-react';

interface ShiftRequest {
  id: string;
  studentId: string;
  location: string;
  day: string;
  shiftType: 'weekday' | 'weekend';
  timeSlot: string;
  hoursPerWeek: number;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: string;
  isInternational?: boolean;
  isAbsence?: boolean;
}

interface CalendarProps {
  requests: ShiftRequest[];
}

const Calendar = ({ requests }: CalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const printRef = useRef<HTMLDivElement>(null);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '6:00-10:00 AM',
    '7:00-11:00 AM', 
    '8:00-12:00 PM',
    '10:00 AM-2:00 PM',
    '12:00-4:00 PM',
    '3:00-7:00 PM',
    '4:00-8:00 PM',
    '7:00-11:00 PM'
  ];

  const locations = ['Kitchen', 'Salad', 'Bakery', 'Wok', 'Pizza', 'Grill', 'Deli', 'Cashier', 'Rotisserie', 'Dishroom', 'Lunch Buffet', 'Courtyard', 'STEAMery'];

  // Get the start of the current week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Get all dates in the current week
  const getWeekDates = (weekStart: Date) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekStart = getWeekStart(currentWeek);
  const weekDates = getWeekDates(weekStart);

  // Filter requests by location and status
  const filteredRequests = requests.filter(request => {
    const matchesLocation = selectedLocation === 'All Locations' || request.location === selectedLocation;
    const isApproved = request.status === 'approved';
    return matchesLocation && isApproved;
  });

  // Group requests by day and time slot
  const getRequestsForDayAndTime = (day: string, timeSlot: string) => {
    return filteredRequests.filter(request => 
      request.day === day && request.timeSlot === timeSlot
    );
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentWeek(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>GustieGo Weekly Schedule</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 20px; }
                .calendar { width: 100%; border-collapse: collapse; }
                .calendar th, .calendar td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .calendar th { background-color: #f8f9fa; font-weight: bold; }
                .time-slot { font-size: 12px; margin-bottom: 4px; }
                .shift-item { 
                  background-color: #e3f2fd; 
                  padding: 2px 4px; 
                  margin: 1px 0; 
                  border-radius: 3px; 
                  font-size: 11px;
                }
                .international { background-color: #fff3e0; }
                .absence { background-color: #ffebee; }
                .location { font-weight: bold; color: #1976d2; }
                .student { color: #333; }
                @media print {
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>GustieGo Weekly Schedule</h1>
                <p>Week of ${weekStart.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</p>
                ${selectedLocation !== 'All Locations' ? `<p>Location: ${selectedLocation}</p>` : ''}
              </div>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Weekly Schedule</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Locations">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
                <Printer className="w-4 h-4 mr-2" />
                Print Schedule
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Week Navigation */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigateWeek('prev')}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Week
              </Button>
              
              <div className="text-center">
                <h2 className="text-lg font-semibold">
                  Week of {weekStart.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </h2>
                <p className="text-sm text-gray-600">
                  {weekStart.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })} - {new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              
              <Button
                variant="outline"
                onClick={() => navigateWeek('next')}
                className="flex items-center space-x-2"
              >
                Next Week
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <div ref={printRef} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left font-semibold text-gray-700 min-w-[120px]">Time</th>
                  {weekDates.map((date, index) => (
                    <th key={index} className="p-4 text-center font-semibold text-gray-700 min-w-[150px]">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">{daysOfWeek[index]}</span>
                        <span className="text-lg">{formatDate(date)}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot} className="border-t border-gray-200">
                    <td className="p-4 text-sm font-medium text-gray-600 bg-gray-50">
                      {timeSlot}
                    </td>
                    {daysOfWeek.map((day) => {
                      const dayRequests = getRequestsForDayAndTime(day, timeSlot);
                      return (
                        <td key={day} className="p-2 border-l border-gray-200 min-h-[100px]">
                          {dayRequests.length > 0 ? (
                            <div className="space-y-1">
                              {dayRequests.map((request) => (
                                <div
                                  key={request.id}
                                  className={`p-2 rounded text-xs ${
                                    request.isInternational 
                                      ? 'bg-orange-100 border-l-4 border-orange-500' 
                                      : request.isAbsence
                                      ? 'bg-red-100 border-l-4 border-red-500'
                                      : 'bg-blue-100 border-l-4 border-blue-500'
                                  }`}
                                >
                                  <div className="font-semibold text-blue-800">
                                    {request.location}
                                  </div>
                                  <div className="text-gray-700">
                                    {request.studentId}
                                  </div>
                                  {request.isInternational && (
                                    <Badge variant="outline" className="text-xs mt-1">Int'l</Badge>
                                  )}
                                  {request.isAbsence && (
                                    <Badge variant="destructive" className="text-xs mt-1">Absence</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-400 text-xs text-center py-4">
                              No shifts
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-100 border-l-4 border-blue-500 rounded"></div>
                <span className="text-sm">Regular Shift</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-orange-100 border-l-4 border-orange-500 rounded"></div>
                <span className="text-sm">International Student</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-100 border-l-4 border-red-500 rounded"></div>
                <span className="text-sm">Absence Request</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredRequests.length}
                </div>
                <div className="text-sm text-gray-600">Total Shifts</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredRequests.filter(r => r.isInternational).length}
                </div>
                <div className="text-sm text-gray-600">International Students</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredRequests.filter(r => r.isAbsence).length}
                </div>
                <div className="text-sm text-gray-600">Absence Requests</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredRequests.reduce((sum, r) => sum + r.hoursPerWeek, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar; 