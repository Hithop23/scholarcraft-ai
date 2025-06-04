'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AuthFormWrapper } from '@/components/auth/AuthFormWrapper';
import { resetPassword } from '@/lib/firebase/authService';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await resetPassword(values.email);
      toast({
        title: 'Check Your Email',
        description: 'If an account exists for this email, a password reset link has been sent.',
      });
      setSubmitted(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send password reset email. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
       <AuthFormWrapper
        title="Check Your Inbox"
        description="A password reset link has been sent to your email address if it's associated with an account. Please follow the instructions in the email to reset your password."
        footerContent={
            <Button variant="link" asChild className="text-primary">
              <Link href="/auth/signin">Back to Sign In</Link>
            </Button>
        }
      >
        <div></div>
      </AuthFormWrapper>
    );
  }

  return (
    <AuthFormWrapper
      title="Forgot Password?"
      description="Enter your email address and we'll send you a link to reset your password."
      footerContent={
        <p className="text-muted-foreground">
          Remember your password?{' '}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
}
