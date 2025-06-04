'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'; // Using the existing custom Sidebar component
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Settings,
  Zap,
  BookOpen,
  FlaskConical,
  MessageSquare,
  UploadCloud,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuthContext';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  children?: NavItem[];
  roles?: string[]; // Add roles if specific items are role-based
}

export function DashboardSidebarNav() {
  const pathname = usePathname();
  const { role } = useAuthContext();

  const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/ai-tools', label: 'AI Learning Tools', icon: Zap, 
      children: [
        { href: '/dashboard/ai-tools#extractor', label: 'Content Extractor', icon: FileText },
        { href: '/dashboard/ai-tools#summarizer', label: 'Summarizer', icon: BookOpen },
        { href: '/dashboard/ai-tools#quiz-generator', label: 'Quiz Generator', icon: FlaskConical },
        { href: '/dashboard/ai-tools#flashcards', label: 'Flashcard Maker', icon: MessageSquare },
      ] 
    },
    { href: '/dashboard/calendar', label: 'Smart Calendar', icon: CalendarDays },
    { href: '/dashboard/files', label: 'My Files', icon: UploadCloud },
    { href: '/dashboard/profile', label: 'Profile', icon: Users },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string, isParent = false) => {
    if (isParent) return pathname.startsWith(href);
    return pathname === href;
  };

  const renderNavItems = (items: NavItem[], isSubMenu = false) => {
    return items.map((item) => {
      if (item.roles && role && !item.roles.includes(role)) {
        return null;
      }

      const MenuButtonComponent = isSubMenu ? SidebarMenuSubButton : SidebarMenuButton;
      const MenuItemComponent = isSubMenu ? SidebarMenuSubItem : SidebarMenuItem;
      
      return (
        <MenuItemComponent key={item.href}>
          <MenuButtonComponent
            asChild={!item.children}
            href={item.children ? undefined : item.href}
            isActive={isActive(item.href, !!item.children)}
            tooltip={item.label}
            className="w-full"
          >
            {item.children ? (
              <>
                <item.icon />
                <span>{item.label}</span>
              </>
            ) : (
              <Link href={item.href} className="flex w-full items-center gap-2">
                <item.icon />
                <span>{item.label}</span>
              </Link>
            )}
          </MenuButtonComponent>
          {item.children && (
            <SidebarMenuSub>
              {renderNavItems(item.children, true)}
            </SidebarMenuSub>
          )}
        </MenuItemComponent>
      );
    });
  };

  return <SidebarMenu>{renderNavItems(navItems)}</SidebarMenu>;
}
