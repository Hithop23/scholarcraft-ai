
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signInWithGoogle, signInWithMicrosoft } from '@/lib/firebase/authService';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Chrome, Shell, Loader2 } from 'lucide-react'; // Added Loader2

export function OAuthButtons({ onLoading }: { onLoading: (isLoading: boolean) => void }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isOAuthLoading, setIsOAuthLoading] = useState(false); // Internal loading state for OAuth buttons

  const handleOAuthSignIn = async (provider: 'google' | 'microsoft') => {
    onLoading(true); // Notify parent component
    setIsOAuthLoading(true); // Set internal loading state

    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithMicrosoft();
      }
      toast({ title: 'Success', description: 'Signed in successfully.' });
      router.push('/dashboard');
    } catch (error: any) {
      console.error(`${provider} sign-in error:`, error);
      // Check for specific error codes that might indicate user cancellation vs. other issues
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        toast({
          variant: 'default', // Or 'destructive' if preferred
          title: 'Sign In Cancelled',
          description: 'The sign-in process was cancelled.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Sign In Failed',
          description: error.message || `Could not sign in with ${provider}. Please try again.`,
        });
      }
    } finally {
      setIsOAuthLoading(false); // Reset internal loading state
      onLoading(false); // Notify parent component
    }
  };

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthSignIn('google')}
        disabled={isOAuthLoading} // Disable button when OAuth is loading
      >
        {isOAuthLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Chrome className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthSignIn('microsoft')}
        disabled={isOAuthLoading} // Disable button when OAuth is loading
      >
        {isOAuthLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Shell className="mr-2 h-4 w-4" />
        )}
        Continue with Microsoft
      </Button>
    </div>
  );
}
