"use client";

import type { ShoppingItem } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type ShoppingListProps = {
  list: { category: string; items: ShoppingItem[] }[];
  onPurchase: (itemId: string, purchased: boolean) => void;
  onDelete: (itemId: string) => void;
};

export function ShoppingList({ list, onPurchase, onDelete }: ShoppingListProps) {
  
  const defaultActive = list.map(l => l.category);

  return (
    <Accordion type="multiple" defaultValue={defaultActive} className="w-full space-y-2">
      {list.map(({ category, items }) => (
        <AccordionItem key={category} value={category} className="border-b-0 rounded-lg bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 text-lg font-headline hover:no-underline">
            {category}
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
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
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
