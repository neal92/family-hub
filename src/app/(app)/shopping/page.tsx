'use client';

import { useState } from 'react';
import { shoppingList as initialShoppingList } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { ShoppingList } from '@/components/shopping-list';
import type { ShoppingItem } from '@/lib/types';

export default function ShoppingPage() {
  const [list, setList] = useState(initialShoppingList);
  const [newItemName, setNewItemName] = useState('');

  const handleAddItem = () => {
    if (newItemName.trim() === '') return;

    const newItem: ShoppingItem = {
      id: `shop-${Date.now()}`,
      name: newItemName.trim(),
      category: 'Divers',
      purchased: false,
    };

    setList(currentList => {
      const otherCategoryIndex = currentList.findIndex(
        cat => cat.category === 'Divers'
      );

      let newList = [...currentList];

      if (otherCategoryIndex > -1) {
        // Add to existing "Divers" category
        const newItems = [...newList[otherCategoryIndex].items, newItem];
        newList[otherCategoryIndex] = {
          ...newList[otherCategoryIndex],
          items: newItems,
        };
      } else {
        // Add new "Divers" category
        newList.push({ category: 'Divers', items: [newItem] });
      }

      return newList;
    });

    setNewItemName('');
  };

  const handlePurchase = (itemId: string, purchased: boolean) => {
    setList(list.map(category => ({
      ...category,
      items: category.items.map(item => item.id === itemId ? { ...item, purchased } : item),
    })));
  };

  const handleDelete = (itemId: string) => {
    setList(list.map(category => ({
      ...category,
      items: category.items.filter(item => item.id !== itemId),
    })).filter(category => category.items.length > 0));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Liste de courses" description="Une liste partagée pour tous les besoins de votre famille. Mise à jour en temps réel." />
      
      <div className="mb-6 flex gap-2">
        <Input 
          placeholder="Ajouter un nouvel article (ex: 'Oeufs')" 
          className="flex-grow"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
        />
        <Button onClick={handleAddItem}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un article
        </Button>
      </div>

      <ShoppingList 
        list={list}
        onPurchase={handlePurchase}
        onDelete={handleDelete}
      />
    </div>
  );
}
