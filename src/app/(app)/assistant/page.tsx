import { PageHeader } from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MealSuggester } from '@/components/ai/meal-suggester';
import { ChoreSuggester } from '@/components/ai/chore-suggester';

export default function AssistantPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Assistant IA"
        description="Votre aide intelligente pour gérer la vie de famille. Obtenez des suggestions de repas, de corvées, d'activités et plus encore."
      />

      <Tabs defaultValue="meals" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="meals">Idées de repas</TabsTrigger>
          <TabsTrigger value="chores">Répartition des tâches</TabsTrigger>
        </TabsList>
        <TabsContent value="meals" className="mt-6">
          <MealSuggester />
        </TabsContent>
        <TabsContent value="chores" className="mt-6">
          <ChoreSuggester />
        </TabsContent>
      </Tabs>
    </div>
  );
}
