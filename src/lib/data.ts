import { Event, Task, ShoppingItem, Document } from './types';

// This file now only contains data that is not user-specific.
// User data is now fetched from Firestore.

const today = new Date();
const getFutureDate = (days: number) => {
    const date = new Date();
    date.setDate(today.getDate() + days);
    return date;
};

export const events: Event[] = [
  { id: 'evt-1', title: "Match de foot d'Emily", date: getFutureDate(2), description: "Match à l'extérieur contre les Aigles.", attendees: ['user-1', 'user-2', 'user-3', 'user-4'] },
  { id: 'evt-2', title: "Rendez-vous dentiste (Ben)", date: getFutureDate(5), description: "Contrôle annuel pour Ben.", attendees: ['user-1', 'user-4'] },
  { id: 'evt-3', title: "Soirée film en famille", date: getFutureDate(7), description: "Pizza et film à la maison.", attendees: ['user-1', 'user-2', 'user-3', 'user-4'] },
  { id: 'evt-4', title: "Réunion parents-professeurs", date: getFutureDate(10), description: "Réunion pour Emily au lycée Northwood.", attendees: ['user-2'] },
  { id: 'evt-5', title: "Anniversaire de Mamie", date: getFutureDate(14), description: "Dîner chez Mamie.", attendees: ['user-1', 'user-2', 'user-3', 'user-4'] },
];

export const tasks: Task[] = [
  { id: 'task-1', title: 'Promener le chien', assignedTo: 'user-3', dueDate: getFutureDate(0), completed: false },
  { id: 'task-2', title: 'Sortir les poubelles', assignedTo: 'user-4', dueDate: getFutureDate(0), completed: true },
  { id: 'task-3', title: 'Planifier les repas de la semaine', assignedTo: 'user-1', dueDate: getFutureDate(1), completed: false },
  { id: 'task-4', title: 'Réparer le robinet qui fuit', assignedTo: 'user-2', dueDate: getFutureDate(3), completed: false },
  { id: 'task-5', title: 'Ranger ta chambre', assignedTo: 'user-3', dueDate: getFutureDate(0), completed: false },
  { id: 'task-6', title: "Finir les devoirs d'histoire", assignedTo: 'user-3', dueDate: getFutureDate(2), completed: false },
  { id: 'task-7', title: 'Arroser les plantes', assignedTo: 'user-4', dueDate: getFutureDate(1), completed: true },
];

export const shoppingList: { category: string, items: ShoppingItem[] }[] = [
  {
    category: "Fruits et légumes",
    items: [
      { id: 'shop-1', name: 'Pommes', category: 'Fruits et légumes', purchased: false },
      { id: 'shop-2', name: 'Brocoli', category: 'Fruits et légumes', purchased: true },
      { id: 'shop-3', name: 'Épinards', category: 'Fruits et légumes', purchased: false },
    ]
  },
  {
    category: "Produits laitiers",
    items: [
      { id: 'shop-4', name: 'Lait', category: 'Produits laitiers', purchased: false },
      { id: 'shop-5', name: 'Fromage cheddar', category: 'Produits laitiers', purchased: false },
      { id: 'shop-6', name: 'Yaourt', category: 'Produits laitiers', purchased: true },
    ]
  },
  {
    category: "Épicerie",
    items: [
      { id: 'shop-7', name: 'Pâtes', category: 'Épicerie', purchased: false },
      { id: 'shop-8', name: "Huile d'olive", category: 'Épicerie', purchased: false },
    ]
  }
];

export const documents: Document[] = [
  { id: 'doc-1', name: "Police d'assurance habitation 2024", category: 'Insurance', dateAdded: new Date('2024-01-15') },
  { id: 'doc-2', name: "Rapport d'allergie de Ben", category: 'Medical', dateAdded: new Date('2023-09-20') },
  { id: 'doc-3', name: 'Relevé de prêt hypothécaire - Mai 2024', category: 'Financial', dateAdded: new Date('2024-05-05') },
  { id: 'doc-4', name: 'Carte grise de la voiture', category: 'Other', dateAdded: new Date('2022-08-10') },
  { id: 'doc-5', name: "Acte de naissance d'Emily", category: 'Medical', dateAdded: new Date('2021-03-30') },
];
