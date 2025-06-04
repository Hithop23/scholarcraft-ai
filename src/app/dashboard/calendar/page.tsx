'use client';

import { SmartCalendar } from '@/components/calendar/SmartCalendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Smart Study Calendar</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Personalized Study Plan</CardTitle>
          <CardDescription>
            View your schedule, upcoming study sessions, and manage your availability. 
            Our AI will adapt your plan based on your progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SmartCalendar />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Configure Availability</CardTitle>
          <CardDescription>
            Let us know when you're free to study, and we'll generate an optimal plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-muted-foreground">Availability configuration feature coming soon!</p>
          {/* Placeholder for availability form/settings */}
        </CardContent>
      </Card>
    </div>
  );
}
