'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Separator } from '@/components/ui/separator';
import { Bell, Palette, ShieldCheck, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { user, role } = useAuthContext();

  // Placeholder states for settings
  // In a real app, these would be fetched and updated from user preferences in Firestore
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);


  if (!user) {
    return <p>Loading settings...</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account preferences and personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Profile Information</h3>
            <p className="text-sm text-muted-foreground">Update your name, email, and password on the <Button variant="link" asChild className="p-0 h-auto"><a href="/dashboard/profile">Profile page</a></Button>.</p>
          </div>
          <Separator/>
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary"/>Security</h3>
            <Button variant="outline">Change Password</Button>
            <p className="text-sm text-muted-foreground mt-2">Two-factor authentication (2FA) coming soon.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Control how you receive updates and reminders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center">
              <Bell className="mr-3 h-5 w-5 text-muted-foreground"/>
              <div>
                <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive updates about your study plan and new features.</p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center">
              <Bell className="mr-3 h-5 w-5 text-muted-foreground"/>
               <div>
                <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Get reminders for study sessions and important alerts.</p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center">
              <Palette className="mr-3 h-5 w-5 text-muted-foreground"/>
               <div>
                <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Toggle between light and dark themes.</p>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={(checked) => {
                setDarkMode(checked);
                document.documentElement.classList.toggle('dark', checked);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Settings</CardTitle>
            <CardDescription>Manage application-wide settings (visible to admins only).</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Admin-specific configurations will appear here.</p>
            <Button variant="outline" className="mt-2">Manage Users</Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center"><Trash2 className="mr-2 h-5 w-5"/>Danger Zone</CardTitle>
          <CardDescription>Irreversible actions related to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Delete Account</Button>
          <p className="text-xs text-muted-foreground mt-2">This will permanently delete your account and all associated data. This action cannot be undone.</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Placeholder for useState, replace with actual state management logic
function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  if (typeof window === 'undefined') {
    // Server-side rendering, return initial state and a no-op setter
    return [initial, () => {}];
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return React.useState(initial);
}
import React from 'react'; // Needed for React.useState in the placeholder
