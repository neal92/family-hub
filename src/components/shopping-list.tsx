"use client";

import type { ShoppingItem } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/card';


type ShoppingListProps = {
  items: ShoppingItem[];
  onPurchase: (itemId: string, purchased: boolean) => void;
  onDelete: (itemId: string) => void;
};


export function ShoppingList({ items, onPurchase, onDelete }: ShoppingListProps) {
  
  if (items.length === 0) {
    return (
        <Card className="flex flex-col items-center justify-center p-8 border-dashed">
            <p className="text-muted-foreground">Votre liste de courses est vide.</p>
        </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <AnimatePresence>
          {items.map(item => (
            <motion.div 
              key={item.id}
              className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
              layout
            >
              <Checkbox
                id={`item-${item.id}`}
                checked={item.purchased}
                onCheckedChange={(checked) => onPurchase(item.id, !!checked)}
                className="h-5 w-5"
              />
              <label
                htmlFor={`item-${item.id}`}
                className={cn(
                  "flex-1 text-sm font-medium cursor-pointer",
                  item.purchased && "line-through text-muted-foreground"
                )}
              >
                {item.name}
              </label>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(item.id)}>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
