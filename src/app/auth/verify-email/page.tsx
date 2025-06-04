'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AuthFormWrapper } from '@/components/auth/AuthFormWrapper';
import { MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <AuthFormWrapper
      title="Verify Your Email Address"
      description="We've sent a verification link to your email. Please check your inbox (and spam folder) and click the link to activate your account."
    >
      <div className="text-center">
        <MailCheck className="mx-auto h-16 w-16 text-green-500 mb-6" />
        <p className="text-muted-foreground mb-6">
          Didn&apos;t receive an email? You might be able to request a new one after signing in, or contact support if issues persist.
        </p>
        <Button asChild>
          <Link href="/auth/signin">
            Go to Sign In
          </Link>
        </Button>
      </div>
    </AuthFormWrapper>
  );
}
