'use client';

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Users, ListChecks, PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { User } from '@/lib/types';

type SuggestChoresOutput = Array<{
  familyMember: string;
  chore: string;
}>;

export function ChoreSuggester() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SuggestChoresOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/family-members')
      .then(res => res.json())
      .then(data => {
        setFamilyMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!familyMembers) return;
    const formData = new FormData(event.currentTarget);
    const chores = (formData.get('chores') as string).split('\n').filter(c => c.trim() !== '');
    if (chores.length === 0) {
      setError('Veuillez entrer au moins une corvée.');
      return;
    }
    const input = {
      familyMembers: familyMembers.map(m => ({
        name: m.name,
        age: m.age || 0,
        skills: m.skills || '',
        availability: m.availability || '',
      })),
      chores,
    };
    setResult(null);
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch('/api/suggest-chores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erreur serveur');
        }
        const data = await response.json();
        setResult(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Une erreur inconnue est survenue.');
      }
    });
  };

  const handleAddTasks = async () => {
    if (!result || !familyMembers) return;
    const newTasks = result.map(assignment => {
      const member = familyMembers.find(m => m.name === assignment.familyMember);
      return {
        title: assignment.chore,
        assignedTo: member ? member.id : 'unassigned',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        completed: false,
      };
    });
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTasks),
      });
      setResult(null);
    } catch {
      setError('Erreur lors de l’ajout des tâches.');
    }
  };

  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline">Aide à l'attribution des tâches</CardTitle>
            <CardDescription>Énumérez les tâches et l'IA suggérera des attributions équitables.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Membres de la famille</Label>
              {loading && <Loader2 className="mt-2 h-5 w-5 animate-spin" />}
              {!loading && familyMembers && (
                <div className="flex flex-wrap gap-4 mt-2">
                  {familyMembers.map(member => (
                    <div key={member.id} className="flex items-center gap-2 p-2 rounded-md bg-muted">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{member.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="chores">Tâches à effectuer</Label>
              <Textarea
                id="chores"
                name="chores"
                placeholder="- Promener le chien&#10;- Sortir les poubelles&#10;- Faire la vaisselle"
                rows={5}
                disabled={isPending || loading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending || loading}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Suggérer les tâches
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Attributions suggérées</CardTitle>
          <CardDescription>Une liste de tâches équilibrée en fonction des compétences et de la disponibilité.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          {isPending && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
          {error && <p className="text-destructive text-sm">{error}</p>}
          {result && result.length > 0 && familyMembers ? (
            <ul className="space-y-4 w-full">
              {result.map((assignment, index) => {
                const member = familyMembers.find(m => m.name === assignment.familyMember);
                return (
                  <li key={index} className="flex items-start gap-4 bg-muted/50 p-3 rounded-lg">
                    {member ? (
                       <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                    ) : <div className="w-10 h-10 rounded-full bg-muted-foreground/20 flex items-center justify-center"><Users className="h-5 w-5"/></div>}
                    <div className="flex-1">
                      <p className="font-semibold">{assignment.chore}</p>
                      <p className="text-sm text-muted-foreground">Assigné à <span className="font-medium text-foreground">{assignment.familyMember}</span></p>
                      {/* <p className="text-xs text-muted-foreground mt-1 italic">"{assignment.reason}"</p> */}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            !isPending && !error && (
              <div className="text-center text-muted-foreground">
                <ListChecks className="mx-auto h-12 w-12" />
                <p className="mt-4">Les attributions de tâches apparaîtront ici.</p>
              </div>
            )
          )}
        </CardContent>
        {result && result.length > 0 && (
          <CardFooter>
            <Button onClick={handleAddTasks} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter à la liste des tâches
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
