import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { TasksProvider } from '@/contexts/tasks-context';
import { AuthProvider } from '@/components/auth/provider';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <TasksProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="min-h-screen">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TasksProvider>
    </AuthProvider>
  );
}
