/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Recipe {
  prepItems: any;
  _id?: string; // Added for backend compatibility
  id?: number;
  name: string;
  category: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  cost: number;
  price: number;
  instructions: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  status: "active" | "inactive";
  createdBy?: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  current: number;
  unit: string;
  minLevel: number;
  maxLevel: number;
  category: string;
  supplier: string;
  cost: number;
  lastUpdated: string;
  status: "good" | "low" | "critical";
}

export interface Transaction {
  id: string;
  date: string;
  ingredient: string;
  type: "Used" | "Added" | "Wasted";
  quantity: number;
  unit: string;
  reason: string;
  orderId: string | null;
  staff: string;
}

export interface PrepItem {
  id: number;
  name: string;
  status: "completed" | "in-progress" | "needed";
  quantity: number;
  unit: string;
  prepTime: string;
  assignedTo: string;
  usedIn: string[];
  lastMade: string;
}

export interface Order {
  id: string;
  tableNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    notes: string;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  status: "preparing" | "ready" | "completed";
  orderTime: string;
  server: string;
  paymentMethod: "Card" | "Cash";
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  description: string;
  prepTime: string;
}

export interface Alert {
  id: number;
  type: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export const recipesData: Recipe[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizza",
    servings: 1,
    prepTime: 15,
    cookTime: 12,
    cost: 7.5,
    price: 12.99,
    instructions: "1. Roll dough 2. Add sauce 3. Add cheese 4. Bake",
    ingredients: [
      { name: "Pizza Dough", quantity: 1, unit: "piece" },
      { name: "Tomato Sauce", quantity: 100, unit: "ml" },
      { name: "Mozzarella", quantity: 150, unit: "g" },
    ],
    status: "active",
    prepItems: undefined
  },
  {
    id: 2,
    name: "Chicken Pasta",
    category: "Pasta",
    servings: 1,
    prepTime: 10,
    cookTime: 18,
    cost: 9.2,
    price: 16.99,
    instructions: "1. Cook pasta 2. Grill chicken 3. Make sauce 4. Combine",
    ingredients: [
      { name: "Pasta", quantity: 200, unit: "g" },
      { name: "Chicken Breast", quantity: 150, unit: "g" },
      { name: "Cream", quantity: 100, unit: "ml" },
    ],
    status: "active",
    prepItems: undefined
  },
  {
    id: 3,
    name: "Caesar Salad",
    category: "Salad",
    servings: 1,
    prepTime: 8,
    cookTime: 0,
    cost: 4.3,
    price: 9.99,
    instructions: "1. Chop lettuce 2. Make dressing 3. Add croutons 4. Toss",
    ingredients: [
      { name: "Lettuce", quantity: 200, unit: "g" },
      { name: "Parmesan", quantity: 50, unit: "g" },
      { name: "Croutons", quantity: 30, unit: "g" },
    ],
    status: "active",
    prepItems: undefined
  },
];

export const inventoryData: InventoryItem[] = [
  {
    id: 1,
    name: "Flour",
    current: 45,
    unit: "kg",
    minLevel: 15,
    maxLevel: 100,
    category: "Baking",
    supplier: "Baker Co",
    cost: 2.5,
    lastUpdated: "2024-01-15",
    status: "good",
  },
  {
    id: 2,
    name: "Tomatoes",
    current: 8,
    unit: "kg",
    minLevel: 15,
    maxLevel: 50,
    category: "Produce",
    supplier: "Fresh Farm",
    cost: 4.2,
    lastUpdated: "2024-01-15",
    status: "low",
  },
  {
    id: 3,
    name: "Mozzarella",
    current: 25,
    unit: "kg",
    minLevel: 10,
    maxLevel: 40,
    category: "Dairy",
    supplier: "Cheese Inc",
    cost: 12.5,
    lastUpdated: "2024-01-15",
    status: "good",
  },
  {
    id: 4,
    name: "Olive Oil",
    current: 3,
    unit: "L",
    minLevel: 8,
    maxLevel: 20,
    category: "Oils",
    supplier: "Oil Corp",
    cost: 15.0,
    lastUpdated: "2024-01-14",
    status: "critical",
  },
  {
    id: 5,
    name: "Chicken Breast",
    current: 12,
    unit: "kg",
    minLevel: 8,
    maxLevel: 25,
    category: "Meat",
    supplier: "Meat Co",
    cost: 18.0,
    lastUpdated: "2024-01-15",
    status: "good",
  },
  {
    id: 6,
    name: "Pasta",
    current: 20,
    unit: "kg",
    minLevel: 5,
    maxLevel: 30,
    category: "Dry Goods",
    supplier: "Pasta Ltd",
    cost: 3.5,
    lastUpdated: "2024-01-15",
    status: "good",
  },
  {
    id: 7,
    name: "Lettuce",
    current: 6,
    unit: "kg",
    minLevel: 10,
    maxLevel: 25,
    category: "Produce",
    supplier: "Fresh Farm",
    cost: 2.8,
    lastUpdated: "2024-01-15",
    status: "low",
  },
  {
    id: 8,
    name: "Parmesan",
    current: 4,
    unit: "kg",
    minLevel: 6,
    maxLevel: 15,
    category: "Dairy",
    supplier: "Cheese Inc",
    cost: 25.0,
    lastUpdated: "2024-01-14",
    status: "low",
  },
];

export const transactionsData: Transaction[] = [
  {
    id: "TXN001",
    date: "2024-01-15 14:30",
    ingredient: "Mozzarella",
    type: "Used",
    quantity: -2,
    unit: "kg",
    reason: "Margherita Pizza Order",
    orderId: "ORD123",
    staff: "Kitchen",
  },
  {
    id: "TXN002",
    date: "2024-01-15 14:30",
    ingredient: "Tomatoes",
    type: "Used",
    quantity: -1.5,
    unit: "kg",
    reason: "Pizza Sauce Prep",
    orderId: null,
    staff: "Kitchen",
  },
  {
    id: "TXN003",
    date: "2024-01-15 12:00",
    ingredient: "Chicken Breast",
    type: "Added",
    quantity: 10,
    unit: "kg",
    reason: "Morning Delivery",
    orderId: null,
    staff: "Inventory",
  },
  {
    id: "TXN004",
    date: "2024-01-15 11:45",
    ingredient: "Flour",
    type: "Used",
    quantity: -3,
    unit: "kg",
    reason: "Pizza Dough Prep",
    orderId: null,
    staff: "Kitchen",
  },
  {
    id: "TXN005",
    date: "2024-01-15 10:30",
    ingredient: "Lettuce",
    type: "Wasted",
    quantity: -2,
    unit: "kg",
    reason: "Expired produce",
    orderId: null,
    staff: "Kitchen",
  },
  {
    id: "TXN006",
    date: "2024-01-14 16:20",
    ingredient: "Olive Oil",
    type: "Used",
    quantity: -0.5,
    unit: "L",
    reason: "Salad Dressing",
    orderId: "ORD118",
    staff: "Kitchen",
  },
  {
    id: "TXN007",
    date: "2024-01-14 15:10",
    ingredient: "Pasta",
    type: "Used",
    quantity: -1.2,
    unit: "kg",
    reason: "Chicken Pasta Orders",
    orderId: "ORD115",
    staff: "Kitchen",
  },
];

export const prepItemsData: PrepItem[] = [
  {
    id: 1,
    name: "Pizza Dough",
    status: "completed",
    quantity: 20,
    unit: "pieces",
    prepTime: "45 mins",
    assignedTo: "Sarah",
    usedIn: ["Margherita Pizza", "Pepperoni Pizza"],
    lastMade: "2024-01-15 08:00",
  },
  {
    id: 2,
    name: "Tomato Sauce",
    status: "in-progress",
    quantity: 5,
    unit: "L",
    prepTime: "30 mins",
    assignedTo: "Mike",
    usedIn: ["Margherita Pizza", "Meat Pizza"],
    lastMade: "2024-01-15 09:30",
  },
  {
    id: 3,
    name: "Alfredo Sauce",
    status: "needed",
    quantity: 0,
    unit: "L",
    prepTime: "20 mins",
    assignedTo: "Sarah",
    usedIn: ["Chicken Pasta", "Seafood Pasta"],
    lastMade: "2024-01-14 16:00",
  },
  {
    id: 4,
    name: "Caesar Dressing",
    status: "completed",
    quantity: 2,
    unit: "L",
    prepTime: "15 mins",
    assignedTo: "Tom",
    usedIn: ["Caesar Salad"],
    lastMade: "2024-01-15 07:00",
  },
  {
    id: 5,
    name: "Bread Croutons",
    status: "needed",
    quantity: 0,
    unit: "kg",
    prepTime: "25 mins",
    assignedTo: "Mike",
    usedIn: ["Caesar Salad", "Soup"],
    lastMade: "2024-01-14 12:00",
  },
];

export const ordersData: Order[] = [
  {
    id: "ORD001",
    tableNumber: "Table 5",
    items: [
      {
        name: "Margherita Pizza",
        quantity: 2,
        price: 12.99,
        notes: "Extra cheese",
      },
      {
        name: "Caesar Salad",
        quantity: 1,
        price: 9.99,
        notes: "Dressing on side",
      },
    ],
    subtotal: 35.97,
    tax: 3.6,
    total: 39.57,
    status: "preparing",
    orderTime: "2024-01-15 14:30",
    server: "Lisa",
    paymentMethod: "Card",
  },
  {
    id: "ORD002",
    tableNumber: "Table 2",
    items: [
      {
        name: "Chicken Pasta",
        quantity: 1,
        price: 16.99,
        notes: "No mushrooms",
      },
    ],
    subtotal: 16.99,
    tax: 1.7,
    total: 18.69,
    status: "completed",
    orderTime: "2024-01-15 13:45",
    server: "John",
    paymentMethod: "Cash",
  },
  {
    id: "ORD003",
    tableNumber: "Table 8",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 12.99, notes: "" },
      {
        name: "Chicken Pasta",
        quantity: 1,
        price: 16.99,
        notes: "Extra parmesan",
      },
    ],
    subtotal: 29.98,
    tax: 3.0,
    total: 32.98,
    status: "ready",
    orderTime: "2024-01-15 14:15",
    server: "Lisa",
    paymentMethod: "Card",
  },
];

export const menuData: MenuItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 12.99,
    category: "Pizza",
    image: "🍕",
    available: true,
    description: "Fresh tomato sauce, mozzarella, basil",
    prepTime: "15 mins",
  },
  {
    id: 2,
    name: "Chicken Pasta",
    price: 16.99,
    category: "Pasta",
    image: "🍝",
    available: true,
    description: "Grilled chicken with creamy alfredo",
    prepTime: "20 mins",
  },
  {
    id: 3,
    name: "Caesar Salad",
    price: 9.99,
    category: "Salad",
    image: "🥗",
    available: false,
    description: "Crisp lettuce, parmesan, croutons",
    prepTime: "8 mins",
  },
  {
    id: 4,
    name: "Garlic Bread",
    price: 4.99,
    category: "Appetizer",
    image: "🍞",
    available: true,
    description: "Fresh baked with garlic butter",
    prepTime: "5 mins",
  },
];

export const alertsData: Alert[] = [
  {
    id: 1,
    type: "critical",
    message: "Olive Oil critically low (3L remaining)",
    timestamp: "2024-01-15 14:45",
    acknowledged: false,
  },
  {
    id: 2,
    type: "warning",
    message: "Tomatoes below minimum level (8kg remaining)",
    timestamp: "2024-01-15 14:30",
    acknowledged: false,
  },
  {
    id: 3,
    type: "info",
    message: "New delivery scheduled for tomorrow",
    timestamp: "2024-01-15 12:00",
    acknowledged: true,
  },
];
