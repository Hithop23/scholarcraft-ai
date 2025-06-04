'use client';

import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-24" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <p>User not found. Please sign in.</p>;
  }
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Your Profile</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User avatar'} />
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.displayName || 'User'}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <CardDescription className="capitalize">Role: {user.role || 'Student'}</CardDescription>
            </div>
          </div>
           <CardDescription>
            Manage your personal information and account settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm currentUser={user} />
        </CardContent>
      </Card>
      
      {/* Placeholder for stats, progress, etc. */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Statistics</CardTitle>
          <CardDescription>Your progress and achievements at a glance.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Detailed statistics coming soon!</p>
           <div className="grid md:grid-cols-3 gap-4 mt-4">
            <Card className="bg-muted/50 p-4 rounded-lg">
              <CardTitle className="text-sm font-medium text-muted-foreground">Courses Completed</CardTitle>
              <p className="text-2xl font-bold">0</p>
            </Card>
            <Card className="bg-muted/50 p-4 rounded-lg">
              <CardTitle className="text-sm font-medium text-muted-foreground">Quizzes Taken</CardTitle>
              <p className="text-2xl font-bold">0</p>
            </Card>
             <Card className="bg-muted/50 p-4 rounded-lg">
              <CardTitle className="text-sm font-medium text-muted-foreground">Study Hours</CardTitle>
              <p className="text-2xl font-bold">0</p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
