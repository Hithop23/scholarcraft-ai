'use client';

import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import Link from 'next/link';

interface AuthFormWrapperProps {
  children: ReactNode;
  title: string;
  description?: string;
  footerContent?: ReactNode;
}

export function AuthFormWrapper({ children, title, description, footerContent }: AuthFormWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
       <div className="absolute top-8 left-8">
         <Logo size="md" />
       </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        {footerContent && (
          <CardFooter className="flex flex-col items-center space-y-2 text-sm">
            {footerContent}
          </CardFooter>
        )}
      </Card>
       <p className="mt-8 text-center text-sm text-muted-foreground">
        Back to <Link href="/" className="underline hover:text-primary">Homepage</Link>
      </p>
    </div>
  );
}
