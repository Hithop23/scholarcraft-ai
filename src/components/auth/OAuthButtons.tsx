'use client';

import { Button } from '@/components/ui/button';
import { signInWithGoogle, signInWithMicrosoft } from '@/lib/firebase/authService';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Chrome, Shell } from 'lucide-react'; // Shell for generic Microsoft icon

export function OAuthButtons({ onLoading }: { onLoading: (isLoading: boolean) => void }) {
  const router = useRouter();
  const { toast } = useToast();

  const handleOAuthSignIn = async (provider: 'google' | 'microsoft') => {
    onLoading(true);
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
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message || `Could not sign in with ${provider}. Please try again.`,
      });
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button variant="outline" className="w-full" onClick={() => handleOAuthSignIn('google')}>
        <Chrome className="mr-2 h-4 w-4" /> Continue with Google
      </Button>
      <Button variant="outline" className="w-full" onClick={() => handleOAuthSignIn('microsoft')}>
        <Shell className="mr-2 h-4 w-4" /> Continue with Microsoft
      </Button>
    </div>
  );
}
