
'use client';

import { useState } from 'react';
// import { apiUrl } from '@/lib/api';
// import { shoppingList as initialShoppingList } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { ShoppingList } from '@/components/shopping-list';
import type { ShoppingItem } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';

// Les items sont maintenant chargés depuis l'API

export default function ShoppingPage() {
  const [list, setList] = useState<ShoppingItem[]>([]);
    const [loading, setLoading] = useState(true);
    // Charger la liste depuis l'API au montage
    useEffect(() => {
      fetch('/api/shopping')
        .then(res => res.json())
        .then(data => {
          setList(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => {
          setList([]);
          setLoading(false);
        });
    }, []);
  const [newItemName, setNewItemName] = useState('');

  const handleAddItem = async () => {
    if (newItemName.trim() === '') return;
    const res = await fetch('/api/shopping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItemName.trim() })
    });
    const newItem = await res.json();
    setList(currentList => [...currentList, newItem]);
    setNewItemName('');
  };

  const handlePurchase = async (itemId: string, purchased: boolean) => {
    const res = await fetch('/api/shopping', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: itemId, purchased })
    });
    const updated = await res.json();
    setList(list.map(item => item.id === itemId ? updated : item));
  };

  const handleDelete = async (itemId: string) => {
    const res = await fetch('/api/shopping', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: itemId })
    });
    const result = await res.json();
    if (result.success) {
      setList(list.filter(item => item.id !== itemId));
    }
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

      {loading ? (
        <div className="flex justify-center"><span>Chargement...</span></div>
      ) : (
        <ShoppingList 
          items={list}
          onPurchase={handlePurchase}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

