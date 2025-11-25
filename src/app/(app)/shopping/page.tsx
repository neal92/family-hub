import { shoppingList } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { ShoppingList } from '@/components/shopping-list';

export default function ShoppingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Liste de courses" description="Une liste partagée pour tous les besoins de votre famille. Mise à jour en temps réel." />
      
      <div className="mb-6 flex gap-2">
        <Input placeholder="Ajouter un nouvel article (ex: 'Oeufs')" className="flex-grow"/>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un article
        </Button>
      </div>

      <ShoppingList initialList={shoppingList} />
    </div>
  );
}
