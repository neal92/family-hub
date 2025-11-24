import { PageHeader } from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MealSuggester } from '@/components/ai/meal-suggester';
import { ChoreSuggester } from '@/components/ai/chore-suggester';

export default function AssistantPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="AI Assistant"
        description="Your smart helper for managing family life. Get suggestions for meals, chores, activities, and more."
      />

      <Tabs defaultValue="meals" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="meals">Meal Ideas</TabsTrigger>
          <TabsTrigger value="chores">Chore Assignments</TabsTrigger>
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
