"use client";

import type { ShoppingItem } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Pencil, Check as CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

type ShoppingListProps = {
  list: { category: string; items: ShoppingItem[] }[];
  onPurchase: (itemId: string, purchased: boolean) => void;
  onDelete: (itemId: string) => void;
  onUpdateCategoryName: (oldName: string, newName: string) => void;
};

const CategoryTitle = ({ name, onUpdate }: { name: string, onUpdate: (newName: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);
  
  useEffect(() => {
    setValue(name);
  }, [name]);

  const handleSave = () => {
    if (value.trim() && value.trim() !== name) {
      onUpdate(value.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setValue(name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 flex-1">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="h-8 text-lg font-headline"
        />
        <Button size="icon" className="h-8 w-8" onClick={handleSave}>
          <CheckIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-2 group cursor-pointer flex-1"
      onClick={() => setIsEditing(true)}
      onFocus={() => setIsEditing(true)}
      tabIndex={0}
      role="button"
      aria-label={`Modifier le nom de la catégorie ${name}`}
    >
      <span className="flex-1">{name}</span>
      <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};


export function ShoppingList({ list, onPurchase, onDelete, onUpdateCategoryName }: ShoppingListProps) {
  
  const defaultActive = list.map(l => l.category);

  return (
    <Accordion type="multiple" defaultValue={defaultActive} className="w-full space-y-2">
      {list.map(({ category, items }) => (
        <AccordionItem key={category} value={category} className="border-b-0 rounded-lg bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 text-lg font-headline hover:no-underline">
            <CategoryTitle name={category} onUpdate={(newName) => onUpdateCategoryName(category, newName)} />
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
