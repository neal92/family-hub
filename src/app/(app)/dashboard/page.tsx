'use client';

import { events, shoppingList } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, ListTodo, ShoppingBasket, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTasks } from '@/contexts/tasks-context';
import { useFirestore, useUser as useAuthUser, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { User } from '@/lib/types';


export default function DashboardPage() {
  const { user: authUser, isUserLoading: authLoading } = useAuthUser();
  const { tasks, toggleTask } = useTasks();
  const firestore = useFirestore();

  // Fetch only the current user's data
  const userRef = useMemoFirebase(() => authUser ? doc(firestore, 'users', authUser.uid) : null, [authUser, firestore]);
  const { data: currentUser, isLoading: userLoading } = useDoc(userRef);
  
  // Fetch all family members for tasks and other components that might need them
  const familyMembersCollection = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const { data: familyMembers, isLoading: familyMembersLoading } = useCollection(familyMembersCollection);

  const pageLoading = authLoading || userLoading || familyMembersLoading;

  const upcomingEvents = events.slice(0, 3);
  const todaysTasks = tasks.filter(t => !t.completed).slice(0, 4);
  const shoppingItemCount = shoppingList.flatMap(c => c.items).filter(i => !i.purchased).length;

  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '';


  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title={currentUser ? `Bienvenue, ${currentUser.name} !` : "Bienvenue, Famille !"} 
        description="Voici ce qui se passe dans votre hub familial aujourd'hui." 
      />
      
       {pageLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card><CardHeader><CardTitle>Événements à venir</CardTitle></CardHeader><CardContent><Loader2 className="h-8 w-8 animate-spin" /></CardContent></Card>
          <Card><CardHeader><CardTitle>Tâches en attente</CardTitle></CardHeader><CardContent><Loader2 className="h-8 w-8 animate-spin" /></CardContent></Card>
          <div className="space-y-6">
            <Card><CardHeader><CardTitle>Liste de courses</CardTitle></CardHeader><CardContent><Loader2 className="h-8 w-8 animate-spin" /></CardContent></Card>
            <Card><CardHeader><CardTitle>Assistant IA</CardTitle></CardHeader><CardContent><Loader2 className="h-8 w-8 animate-spin" /></CardContent></Card>
          </div>
        </div>
      )}
      
      {!pageLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Upcoming Events */}
          <Card className="flex flex-col transition-transform hover:scale-[1.02] hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium font-headline">Événements à venir</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-4">
                {upcomingEvents.map(event => (
                  <li key={event.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center bg-muted text-muted-foreground rounded-lg p-2 h-14 w-14">
                      <span className="text-sm font-bold">{format(event.date, 'MMM', { locale: fr })}</span>
                      <span className="text-xl font-bold">{format(event.date, 'd')}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="p-6 pt-0">
               <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/calendar">Voir le calendrier complet <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </Card>

          {/* Today's Tasks */}
          <Card className="flex flex-col transition-transform hover:scale-[1.02] hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium font-headline">Tâches en attente</CardTitle>
              <ListTodo className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {todaysTasks.map(task => {
                  const member = familyMembers?.find(m => m.id === task.assignedTo);
                  return (
                    <li key={task.id} className="flex items-center gap-3">
                      <Checkbox id={`task-dashboard-${task.id}`} checked={task.completed} onCheckedChange={(checked) => toggleTask(task.id, !!checked)} />
                      <label htmlFor={`task-dashboard-${task.id}`} className="flex-1 text-sm font-medium">{task.title}</label>
                      {member && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                      )}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/tasks">Gérer toutes les tâches <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </Card>

          {/* Combined Card for Shopping & AI */}
          <div className="space-y-6">
            <Card className="transition-transform hover:scale-[1.02] hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium font-headline">Liste de courses</CardTitle>
                <ShoppingBasket className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{shoppingItemCount} articles</p>
                <p className="text-xs text-muted-foreground">actuellement sur la liste</p>
                 <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                  <Link href="/shopping">Voir la liste <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-primary/80 to-accent/80 text-primary-foreground transition-transform hover:scale-[1.02] hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium font-headline">Assistant IA</CardTitle>
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm">Obtenez de l'aide pour les idées de repas, l'attribution des tâches, et plus encore.</p>
                <Button asChild variant="secondary" size="sm" className="mt-4 w-full text-accent-foreground bg-white/20 hover:bg-white/30">
                  <Link href="/assistant">Demander à l'IA <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
