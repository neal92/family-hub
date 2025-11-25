
'use client';

import { useState } from 'react';
import { shoppingList as initialShoppingList } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { ShoppingList } from '@/components/shopping-list';
import type { ShoppingItem } from '@/lib/types';
import { Label } from '@/components/ui/label';

// Flatten the initial list
const flatInitialList = initialShoppingList.flatMap(category => category.items);

export default function ShoppingPage() {
  const [list, setList] = useState<ShoppingItem[]>(flatInitialList);
  const [newItemName, setNewItemName] = useState('');

  const handleAddItem = () => {
    if (newItemName.trim() === '') return;

    const newItem: ShoppingItem = {
      id: `shop-${Date.now()}`,
      name: newItemName.trim(),
      category: 'Default', // No longer used, but kept for type consistency
      purchased: false,
    };

    setList(currentList => [...currentList, newItem]);
    setNewItemName('');
  };

  const handlePurchase = (itemId: string, purchased: boolean) => {
    setList(list.map(item => item.id === itemId ? { ...item, purchased } : item));
  };

  const handleDelete = (itemId: string) => {
    setList(list.filter(item => item.id !== itemId));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Liste de courses" description="Une liste partagée pour tous les besoins de votre famille. Mise à jour en temps réel." />
      
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-grow w-full">
          <Label htmlFor="itemName">Nom de l'article</Label>
          <Input
            id="itemName" 
            placeholder="Ex: 'Oeufs'"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          />
        </div>
        <Button onClick={handleAddItem} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Ajouter
        </Button>
      </div>

      <ShoppingList 
        items={list}
        onPurchase={handlePurchase}
        onDelete={handleDelete}
      />
    </div>
  );
}
