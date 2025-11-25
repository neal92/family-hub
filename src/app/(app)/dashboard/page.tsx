import { familyMembers, events, tasks, shoppingList } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, ListTodo, ShoppingBasket, Sparkles, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DashboardPage() {
  const upcomingEvents = events.slice(0, 3);
  const todaysTasks = tasks.filter(t => !t.completed).slice(0, 4);
  const shoppingItemCount = shoppingList.flatMap(c => c.items).filter(i => !i.purchased).length;

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Bienvenue, Famille !" description="Voici ce qui se passe dans votre hub familial aujourd'hui." />
      
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
                const member = familyMembers.find(m => m.id === task.assignedTo);
                return (
                  <li key={task.id} className="flex items-center gap-3">
                    <Checkbox id={`task-${task.id}`} checked={task.completed} />
                    <label htmlFor={`task-${task.id}`} className="flex-1 text-sm font-medium">{task.title}</label>
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
    </div>
  );
}
