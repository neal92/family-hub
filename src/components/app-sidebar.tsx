'use client';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  ListTodo,
  ShoppingBasket,
  Sparkles,
  Folder,
  Users,
  LogOut,
  Settings,
  MoreHorizontal,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { BottomBar, BottomBarItem } from '@/components/bottom-bar';

const mainNavItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/tasks', icon: ListTodo, label: 'Tasks' },
  { href: '/shopping', icon: ShoppingBasket, label: 'Shopping' },
];

const secondaryNavItems = [
  { href: '/assistant', icon: Sparkles, label: 'AI Assistant' },
  { href: '/documents', icon: Folder, label: 'Documents' },
  { href: '/family', icon: Users, label: 'Family' },
]

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  if (isMobile) {
    return (
      <BottomBar>
        {mainNavItems.map((item) => (
            <BottomBarItem 
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
        ))}
        <BottomBarItem 
            href="/assistant"
            icon={Sparkles}
            label="Assistant"
            isActive={pathname.startsWith('/assistant')}
        />
      </BottomBar>
    );
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
            <Home className="w-6 h-6" />
          </div>
          <span className="text-lg font-bold font-headline">Family Hub</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarMenu>
          {secondaryNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log out">
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
