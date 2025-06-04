'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
      <Logo size="lg" className="mb-8" />
      <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
      <h2 className="text-3xl font-headline font-semibold mb-4 text-foreground">Oops! Something went wrong.</h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        We encountered an unexpected issue. Please try again, or if the problem persists, contact support.
      </p>
      {error?.message && (
        <p className="text-sm text-muted-foreground/70 mb-2">Error details: {error.message}</p>
      )}
      {error?.digest && (
         <p className="text-xs text-muted-foreground/50 mb-6">Digest: {error.digest}</p>
      )}
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        size="lg"
      >
        Try again
      </Button>
      <Button variant="link" asChild className="mt-4 text-primary">
        <a href="/">Go to Homepage</a>
      </Button>
    </div>
  );
}
