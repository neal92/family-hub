'use client';

import { useState, useTransition } from 'react';
import { suggestMealIdeas, SuggestMealIdeasOutput } from '@/ai/flows/suggest-meal-ideas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, UtensilsCrossed } from 'lucide-react';

export function MealSuggester() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SuggestMealIdeasOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const input = {
      dietaryRestrictions: formData.get('dietaryRestrictions') as string,
      availableIngredients: formData.get('availableIngredients') as string,
      pastPreferences: formData.get('pastPreferences') as string,
    };

    setResult(null);
    setError(null);
    startTransition(async () => {
      try {
        const response = await suggestMealIdeas(input);
        setResult(response);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline">Meal Idea Generator</CardTitle>
            <CardDescription>Tell the AI your preferences and what you have on hand.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
              <Input
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                placeholder="e.g., vegetarian, gluten-free"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableIngredients">Available Ingredients</Label>
              <Input
                id="availableIngredients"
                name="availableIngredients"
                placeholder="e.g., chicken, rice, tomatoes, spinach"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pastPreferences">Family's Favorite Meals</Label>
              <Textarea
                id="pastPreferences"
                name="pastPreferences"
                placeholder="e.g., loves Italian, not spicy, enjoys tacos"
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
              Suggest Meals
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Suggestions</CardTitle>
          <CardDescription>Here are some meal ideas curated just for you.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          {isPending && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
          {error && <p className="text-destructive text-sm">{error}</p>}
          {result ? (
            <div className="space-y-2 text-sm">
                {result.mealSuggestions.split('\n').map((idea, index) => (
                    idea.trim() && <p key={index}>{idea.trim()}</p>
                ))}
            </div>
          ) : (
            !isPending && !error && (
              <div className="text-center text-muted-foreground">
                <UtensilsCrossed className="mx-auto h-12 w-12" />
                <p className="mt-4">Your meal suggestions will appear here.</p>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
