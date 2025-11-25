
'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { shoppingList as initialShoppingList } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Sparkles } from 'lucide-react';
import { ShoppingList } from '@/components/shopping-list';
import type { ShoppingItem, ShoppingListCategory } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { suggestShoppingCategory } from '@/ai/flows/suggest-shopping-category';
import { useDebounce } from '@/hooks/use-debounce';

export default function ShoppingPage() {
  const [list, setList] = useState(initialShoppingList);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Divers');
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const debouncedItemName = useDebounce(newItemName, 500);

  useEffect(() => {
    if (debouncedItemName.trim().length > 2) {
      setIsAiSuggesting(true);
      suggestShoppingCategory({ itemName: debouncedItemName })
        .then(response => {
          if (response.category) {
            setNewItemCategory(response.category);
          }
        })
        .catch(console.error)
        .finally(() => setIsAiSuggesting(false));
    }
  }, [debouncedItemName]);

  const handleAddItem = () => {
    if (newItemName.trim() === '' || newItemCategory.trim() === '') return;

    const newItem: ShoppingItem = {
      id: `shop-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory.trim(),
      purchased: false,
    };

    setList(currentList => {
      const categoryIndex = currentList.findIndex(
        cat => cat.category.toLowerCase() === newItem.category.toLowerCase()
      );

      let newList = [...currentList];

      if (categoryIndex > -1) {
        const newItems = [...newList[categoryIndex].items, newItem];
        newList[categoryIndex] = {
          ...newList[categoryIndex],
          items: newItems,
        };
      } else {
        newList.push({ category: newItem.category, items: [newItem] });
      }

      return newList;
    });

    setNewItemName('');
    setNewItemCategory('Divers');
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
  
  const handleUpdateCategoryName = (oldName: string, newName: string) => {
    setList(currentList => {
      // Check if the new category name already exists
      const existingCategory = currentList.find(cat => cat.category.toLowerCase() === newName.toLowerCase());

      if (existingCategory && existingCategory.category.toLowerCase() !== oldName.toLowerCase()) {
        // Merge with existing category
        const categoryToMerge = currentList.find(cat => cat.category === oldName);
        if (!categoryToMerge) return currentList;

        const mergedItems = [...existingCategory.items, ...categoryToMerge.items];
        const updatedList = currentList.filter(cat => cat.category !== oldName);
        const targetIndex = updatedList.findIndex(cat => cat.category === existingCategory.category);
        updatedList[targetIndex].items = mergedItems;
        
        return updatedList;
      } else {
         // Rename the category
        return currentList.map(cat => 
          cat.category === oldName ? { ...cat, category: newName } : cat
        );
      }
    });
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
        <div className="w-full md:w-auto relative">
          <Label htmlFor="itemCategory">Catégorie</Label>
          <Input
            id="itemCategory" 
            placeholder="Ex: 'Produits laitiers'" 
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <div className="absolute top-7 right-2 flex items-center justify-center">
            {isAiSuggesting ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
        <Button onClick={handleAddItem} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Ajouter
        </Button>
      </div>

      <ShoppingList 
        list={list}
        onPurchase={handlePurchase}
        onDelete={handleDelete}
        onUpdateCategoryName={handleUpdateCategoryName}
      />
    </div>
  );
}
