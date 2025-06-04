'use client';

import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar"; // ShadCN Calendar
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

// Mock data - replace with actual data fetching
interface StudySession {
  id: string;
  date: Date;
  title: string;
  subject: string;
  duration: number; // in minutes
  completed?: boolean;
}

const mockSessions: StudySession[] = [
  { id: '1', date: new Date(new Date().setDate(new Date().getDate() + 1)), title: 'Calculus Ch. 3 Review', subject: 'Mathematics', duration: 60 },
  { id: '2', date: new Date(new Date().setDate(new Date().getDate() + 2)), title: 'History Midterm Prep', subject: 'History', duration: 90, completed: true },
  { id: '3', date: new Date(new Date().setDate(new Date().getDate() + 3)), title: 'Physics Lab Report', subject: 'Physics', duration: 120 },
];


export function SmartCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [clientRendered, setClientRendered] = useState(false);

  useEffect(() => {
    setClientRendered(true);
    // Fetch actual sessions for the user here
    setSessions(mockSessions);
  }, []);

  if (!clientRendered) {
    return <div className="p-4 text-center">Loading calendar...</div>; // Or a Skeleton loader
  }

  const todaysSessions = sessions.filter(
    session => selectedDate && session.date.toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} // Disable past dates
            />
          </CardContent>
        </Card>
         <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Adaptive Planning</AlertTitle>
            <AlertDescription>
              Your study plan adapts based on your performance and availability. Keep your progress updated!
            </AlertDescription>
          </Alert>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Study Sessions for {selectedDate ? selectedDate.toLocaleDateString() : 'Today'}</CardTitle>
            <CardDescription>Here are your planned study activities.</CardDescription>
          </CardHeader>
          <CardContent>
            {todaysSessions.length > 0 ? (
              <ul className="space-y-4">
                {todaysSessions.map(session => (
                  <li key={session.id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-muted/50">
                    <div>
                      <h3 className="font-semibold">{session.title} <Badge variant={session.completed ? "secondary" : "default"}>{session.subject}</Badge></h3>
                      <p className="text-sm text-muted-foreground">{session.duration} minutes</p>
                    </div>
                    <Button variant={session.completed ? "outline" : "default"} size="sm">
                      {session.completed ? 'View Details' : 'Start Session'}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No study sessions scheduled for this day. Enjoy your break or plan a new session!</p>
            )}
             <Button className="mt-6 w-full">Add New Study Session</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
