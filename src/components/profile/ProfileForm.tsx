'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfileDocument } from '@/lib/firebase/firestoreService';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { auth } } from '@/lib/firebase/client';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  displayName: z.string().min(1, 'Display name is required.'),
  // Add other fields like photoURL if you want to allow URL input
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  currentUser: UserProfile;
}

export function ProfileForm({ currentUser }: ProfileFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentUser.firstName || currentUser.displayName?.split(' ')[0] || '',
      lastName: currentUser.lastName || currentUser.displayName?.split(' ').slice(1).join(' ') || '',
      displayName: currentUser.displayName || '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    try {
      if (auth.currentUser) {
        // Update Firebase Auth profile (mainly for displayName)
        await updateFirebaseProfile(auth.currentUser, { displayName: values.displayName });
      }
      // Update Firestore document
      await updateUserProfileDocument(currentUser.uid, {
        firstName: values.firstName,
        lastName: values.lastName,
        displayName: values.displayName,
      });

      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been successfully updated.',
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Could not update profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
                <p className="text-sm text-muted-foreground">This name will be visible to others.</p>
              </FormItem>
            )}
          />
        
        <FormField
            name="email"
            render={() => ( // Not a real form field, just display
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" value={currentUser.email || ''} disabled readOnly />
                </FormControl>
                 <p className="text-sm text-muted-foreground">Email address cannot be changed here.</p>
              </FormItem>
            )}
          />

        <Button type="submit" disabled={isLoading}>
           {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
