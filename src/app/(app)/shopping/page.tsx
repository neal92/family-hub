import { shoppingList } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { ShoppingList } from '@/components/shopping-list';

export default function ShoppingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Shopping List" description="A shared list for all your family's needs. Updated in real-time." />
      
      <div className="mb-6 flex gap-2">
        <Input placeholder="Add a new item (e.g., 'Eggs')" className="flex-grow"/>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <ShoppingList initialList={shoppingList} />
    </div>
  );
}
