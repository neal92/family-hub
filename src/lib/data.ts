import { User, Event, Task, ShoppingItem, Document } from './types';
import { PlaceHolderImages } from './placeholder-images';

const avatar1 = PlaceHolderImages.find((img) => img.id === 'avatar-1')?.imageUrl || '';
const avatar2 = PlaceHolderImages.find((img) => img.id === 'avatar-2')?.imageUrl || '';
const avatar3 = PlaceHolderImages.find((img) => img.id === 'avatar-3')?.imageUrl || '';
const avatar4 = PlaceHolderImages.find((img) => img.id === 'avatar-4')?.imageUrl || '';


export const familyMembers: User[] = [
  { id: 'user-1', name: 'Sarah', avatarUrl: avatar1, age: 42, skills: "Cooking, organizing", availability: "Weekends, weekday evenings" },
  { id: 'user-2', name: 'Tom', avatarUrl: avatar2, age: 45, skills: "DIY projects, driving", availability: "Weekends" },
  { id: 'user-3', name: 'Emily', avatarUrl: avatar3, age: 16, skills: "Baking, tech support", availability: "After school" },
  { id: 'user-4', name: 'Ben', avatarUrl: avatar4, age: 11, skills: "Pet care", availability: "Weekends" },
];

const today = new Date();
const getFutureDate = (days: number) => {
    const date = new Date();
    date.setDate(today.getDate() + days);
    return date;
};

export const events: Event[] = [
  { id: 'evt-1', title: "Emily's Soccer Match", date: getFutureDate(2), description: "Away game vs. the Eagles.", attendees: ['user-1', 'user-2', 'user-3', 'user-4'] },
  { id: 'evt-2', title: "Dentist Appointment (Ben)", date: getFutureDate(5), description: "Annual check-up for Ben.", attendees: ['user-1', 'user-4'] },
  { id: 'evt-3', title: "Family Movie Night", date: getFutureDate(7), description: "Pizza and a movie at home.", attendees: ['user-1', 'user-2', 'user-3', 'user-4'] },
  { id: 'evt-4', title: "Parent-Teacher Conference", date: getFutureDate(10), description: "Conference for Emily at Northwood High.", attendees: ['user-2'] },
  { id: 'evt-5', title: "Grandma's Birthday", date: getFutureDate(14), description: "Dinner at Grandma's house.", attendees: ['user-1', 'user-2', 'user-3', 'user-4'] },
];

export const tasks: Task[] = [
  { id: 'task-1', title: 'Walk the dog', assignedTo: 'user-3', dueDate: getFutureDate(0), completed: false },
  { id: 'task-2', title: 'Take out the trash', assignedTo: 'user-4', dueDate: getFutureDate(0), completed: true },
  { id: 'task-3', title: 'Plan weekly meals', assignedTo: 'user-1', dueDate: getFutureDate(1), completed: false },
  { id: 'task-4', title: 'Fix leaky faucet', assignedTo: 'user-2', dueDate: getFutureDate(3), completed: false },
  { id: 'task-5', title: 'Clean your room', assignedTo: 'user-3', dueDate: getFutureDate(0), completed: false },
  { id: 'task-6', title: 'Finish history homework', assignedTo: 'user-3', dueDate: getFutureDate(2), completed: false },
  { id: 'task-7', title: 'Water the plants', assignedTo: 'user-4', dueDate: getFutureDate(1), completed: true },
];

export const shoppingList: { category: string, items: ShoppingItem[] }[] = [
  {
    category: "Produce",
    items: [
      { id: 'shop-1', name: 'Apples', category: 'Produce', purchased: false },
      { id: 'shop-2', name: 'Broccoli', category: 'Produce', purchased: true },
      { id: 'shop-3', name: 'Spinach', category: 'Produce', purchased: false },
    ]
  },
  {
    category: "Dairy",
    items: [
      { id: 'shop-4', name: 'Milk', category: 'Dairy', purchased: false },
      { id: 'shop-5', name: 'Cheddar Cheese', category: 'Dairy', purchased: false },
      { id: 'shop-6', name: 'Yogurt', category: 'Dairy', purchased: true },
    ]
  },
  {
    category: "Pantry",
    items: [
      { id: 'shop-7', name: 'Pasta', category: 'Pantry', purchased: false },
      { id: 'shop-8', name: 'Olive Oil', category: 'Pantry', purchased: false },
    ]
  }
];

export const documents: Document[] = [
  { id: 'doc-1', name: 'Home Insurance Policy 2024', category: 'Insurance', dateAdded: new Date('2024-01-15') },
  { id: 'doc-2', name: "Ben's Allergy Report", category: 'Medical', dateAdded: new Date('2023-09-20') },
  { id: 'doc-3', name: 'Mortgage Statement - May 2024', category: 'Financial', dateAdded: new Date('2024-05-05') },
  { id: 'doc-4', name: 'Car Title', category: 'Other', dateAdded: new Date('2022-08-10') },
  { id: 'doc-5', name: "Emily's Birth Certificate", category: 'Medical', dateAdded: new Date('2021-03-30') },
];
