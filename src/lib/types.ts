export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  age?: number;
  skills?: string;
  availability?: string;
  email?: string;
};

export type Event = {
  id: string;
  title: string;
  date: Date;
  description: string;
  attendees: string[];
};

export type Task = {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: Date;
  completed: boolean;
};

export type ShoppingItem = {
  id: string;
  name: string;
  category: string;
  purchased: boolean;
};

export type ShoppingListCategory = {
  category: string;
  items: ShoppingItem[];
};

export type Document = {
  id: string;
  name: string;
  category: 'Insurance' | 'Medical' | 'Financial' | 'Other';
  dateAdded: Date;
};
