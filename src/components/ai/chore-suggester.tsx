'use client';

import { useState, useTransition } from 'react';
import { suggestChores, SuggestChoresOutput } from '@/ai/flows/suggest-chores';
import { familyMembers as allFamilyMembers } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Users, ListChecks } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function ChoreSuggester() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SuggestChoresOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const chores = (formData.get('chores') as string).split('\n').filter(c => c.trim() !== '');
    
    if (chores.length === 0) {
      setError("Please enter at least one chore.");
      return;
    }

    const input = {
      familyMembers: allFamilyMembers,
      chores,
    };

    setResult(null);
    setError(null);
    startTransition(async () => {
      try {
        const response = await suggestChores(input);
        setResult(response);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      }
    });
  };

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline">Chore Assignment Helper</CardTitle>
            <CardDescription>List the chores, and the AI will suggest fair assignments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Family Members</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {allFamilyMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-2 p-2 rounded-md bg-muted">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="chores">Chores to be done</Label>
              <Textarea
                id="chores"
                name="chores"
                placeholder="- Walk the dog&#10;- Take out the trash&#10;- Wash dishes"
                rows={5}
                disabled={isPending}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Assign Chores
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Suggested Assignments</CardTitle>
          <CardDescription>A balanced chore list based on skills and availability.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          {isPending && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
          {error && <p className="text-destructive text-sm">{error}</p>}
          {result ? (
            <ul className="space-y-4 w-full">
              {result.map((assignment, index) => {
                const member = allFamilyMembers.find(m => m.name === assignment.familyMember);
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
                      <p className="text-sm text-muted-foreground">Assigned to <span className="font-medium text-foreground">{assignment.familyMember}</span></p>
                      <p className="text-xs text-muted-foreground mt-1 italic">"{assignment.reason}"</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            !isPending && !error && (
              <div className="text-center text-muted-foreground">
                <ListChecks className="mx-auto h-12 w-12" />
                <p className="mt-4">Chore assignments will appear here.</p>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
