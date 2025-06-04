'use client';

import { UserNav } from '@/components/layout/UserNav';
import Logo from '@/components/Logo';
import { SidebarTrigger } from '@/components/ui/sidebar'; // From existing sidebar component

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="md:hidden"> {/* Only show trigger on mobile, Sidebar component handles its own trigger for desktop */}
            <SidebarTrigger /> 
          </div>
          <div className="hidden md:block"> {/* Hide Logo on mobile if sidebar is open, show on desktop */}
            <Logo size="sm" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Add any other header items like notifications bell here */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
