'use client';

import { useState, useTransition } from 'react';
import { suggestMealIdeas } from '@/ai/flows/suggest-meal-ideas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, UtensilsCrossed, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';

interface MealSuggestion {
  name: string;
  description: string;
  recipe: string;
  imageUrl?: string;
}

export function MealSuggester() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<MealSuggestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<MealSuggestion | null>(null);

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
        setResult(response.mealSuggestions);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      }
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
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
        
        <div className="flex flex-col gap-4">
          <CardHeader className="p-0">
              <CardTitle className="font-headline">Suggestions</CardTitle>
              <CardDescription>Here are some meal ideas curated just for you.</CardDescription>
          </CardHeader>

          {isPending && <div className="w-full h-64 flex items-center justify-center bg-card rounded-lg"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}
          {error && <p className="text-destructive text-sm">{error}</p>}
          
          {result && result.length > 0 && (
            <div className="space-y-4">
              {result.map((suggestion, index) => (
                 <Card key={index} className="overflow-hidden">
                    {suggestion.imageUrl && (
                      <div className="relative aspect-video w-full">
                        <Image src={suggestion.imageUrl} alt={suggestion.name} fill className="object-cover" />
                      </div>
                    )}
                   <CardHeader>
                      <CardTitle>{suggestion.name}</CardTitle>
                      <CardDescription>{suggestion.description}</CardDescription>
                   </CardHeader>
                   <CardFooter>
                      <Button variant="outline" onClick={() => setSelectedRecipe(suggestion)}>
                        <BookOpen className="mr-2 h-4 w-4"/>
                        View Recipe
                      </Button>
                   </CardFooter>
                 </Card>
              ))}
            </div>
          )}

          {!isPending && !error && (!result || result.length === 0) && (
            <Card className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground p-8">
              <UtensilsCrossed className="mx-auto h-12 w-12" />
              <p className="mt-4">Your meal suggestions will appear here.</p>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={!!selectedRecipe} onOpenChange={(open) => !open && setSelectedRecipe(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">{selectedRecipe?.name}</DialogTitle>
            <DialogDescription>{selectedRecipe?.description}</DialogDescription>
          </DialogHeader>
          {selectedRecipe?.imageUrl && (
            <div className="relative aspect-video w-full rounded-md overflow-hidden my-4">
              <Image src={selectedRecipe.imageUrl} alt={selectedRecipe.name} fill className="object-cover" />
            </div>
          )}
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none whitespace-pre-wrap">
            {selectedRecipe?.recipe.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
