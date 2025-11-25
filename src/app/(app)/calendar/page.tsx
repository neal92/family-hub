'use client';

import { events, familyMembers } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  const selectedDate = date || new Date();
  const todaysEvents = events.filter(event => format(event.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'));

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Calendrier familial" description="Coordonnez les événements et les rendez-vous.">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nouvel événement
        </Button>
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md w-full"
                locale={fr}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <h2 className="font-headline text-xl font-semibold">Événements pour {format(selectedDate, 'd MMMM', { locale: fr })}</h2>
          {todaysEvents.length > 0 ? (
            todaysEvents.map(event => (
              <Card key={event.id} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Participants:</span>
                    <div className="flex -space-x-2">
                      {event.attendees.map(userId => {
                        const member = familyMembers.find(m => m.id === userId);
                        return member ? (
                          <Avatar key={member.id} className="border-2 border-card h-8 w-8">
                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                        ) : null;
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="flex flex-col items-center justify-center p-8 border-dashed">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4"/>
                <p className="text-muted-foreground">Aucun événement prévu pour ce jour.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
