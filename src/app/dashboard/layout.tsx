import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { DashboardSidebarNav } from '@/components/layout/DashboardSidebarNav';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarRail
} from '@/components/ui/sidebar'; // Using the existing custom Sidebar component
import Logo from '@/components/Logo';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={true} > {/* Control sidebar state here */}
        <Sidebar variant="sidebar" collapsible="icon"> {/* Use "icon" for compact mode */}
          <SidebarHeader className="p-4">
             {/* Logo visible when sidebar is expanded */}
            <div className="group-data-[collapsible=icon]:hidden">
                <Logo size="sm"/>
            </div>
            {/* Icon-only logo visible when sidebar is collapsed */}
            <div className="hidden group-data-[collapsible=icon]:block">
                <Logo size="sm"/> {/* This will only show icon part effectively due to small space */}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea className="h-full">
              <DashboardSidebarNav />
            </ScrollArea>
          </SidebarContent>
          <SidebarFooter>
            {/* Footer content for sidebar, if any */}
          </SidebarFooter>
        </Sidebar>
        <SidebarRail /> {/* Adds the draggable rail */}
        <SidebarInset> {/* This is the main content area */}
          <DashboardHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
