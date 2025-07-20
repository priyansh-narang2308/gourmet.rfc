
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'chef' | 'pos';
  avatar: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  tags: string[];
  prepTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
  steps: string[];
  ingredients: RecipeIngredient[];
  subRecipes?: string[];
  versions: RecipeVersion[];
  createdBy: string;
  createdAt: string;
  archived: boolean;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeVersion {
  id: string;
  version: number;
  changes: string;
  createdBy: string;
  createdAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  stock: number;
  threshold: number;
  category: string;
  recentUsage: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  createdAt: string;
  createdBy: string;
}

export interface OrderItem {
  recipeId: string;
  recipeName: string;
  quantity: number;
  price: number;
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'usage_spike' | 'system';
  title: string;
  message: string;
  ingredient?: string;
  severity: 'low' | 'medium' | 'high';
  status: 'new' | 'acknowledged' | 'resolved';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: 'recipe' | 'ingredient' | 'order' | 'user';
  entityName: string;
  userId: string;
  userName: string;
  timestamp: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changes?: any;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Chen',
    email: 'alice@gourmet.rfc',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'marcus@gourmet.rfc',
    role: 'chef',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Sarah Kim',
    email: 'sarah@gourmet.rfc',
    role: 'pos',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  }
];

export const mockIngredients: Ingredient[] = [
  { id: '1', name: 'Tomatoes', unit: 'kg', stock: 5.2, threshold: 10, category: 'Vegetables', recentUsage: 8.3 },
  { id: '2', name: 'Olive Oil', unit: 'L', stock: 15.7, threshold: 5, category: 'Oils', recentUsage: 2.1 },
  { id: '3', name: 'Fresh Basil', unit: 'bunches', stock: 3, threshold: 8, category: 'Herbs', recentUsage: 12.5 },
  { id: '4', name: 'Mozzarella', unit: 'kg', stock: 12.4, threshold: 6, category: 'Dairy', recentUsage: 4.2 },
  { id: '5', name: 'Flour', unit: 'kg', stock: 25.0, threshold: 15, category: 'Grains', recentUsage: 3.8 },
  { id: '6', name: 'Chicken Breast', unit: 'kg', stock: 8.1, threshold: 12, category: 'Protein', recentUsage: 15.2 }
];

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    category: 'Italian',
    tags: ['vegetarian', 'popular'],
    prepTime: 25,
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop',
    steps: [
      'Prepare pizza dough and let rise',
      'Roll out dough to desired thickness',
      'Spread tomato sauce evenly',
      'Add fresh mozzarella slices',
      'Bake at 450°F for 12-15 minutes',
      'Garnish with fresh basil leaves'
    ],
    ingredients: [
      { id: '1', name: 'Tomatoes', quantity: 200, unit: 'g' },
      { id: '2', name: 'Mozzarella', quantity: 150, unit: 'g' },
      { id: '3', name: 'Fresh Basil', quantity: 0.2, unit: 'bunches' },
      { id: '4', name: 'Flour', quantity: 300, unit: 'g' },
      { id: '5', name: 'Olive Oil', quantity: 30, unit: 'ml' }
    ],
    versions: [
      { id: '1', version: 1, changes: 'Initial recipe', createdBy: 'Marcus Rodriguez', createdAt: '2025-01-15T09:00:00Z' },
      { id: '2', version: 2, changes: 'Adjusted baking time', createdBy: 'Marcus Rodriguez', createdAt: '2025-01-16T14:30:00Z' }
    ],
    createdBy: 'Marcus Rodriguez',
    createdAt: '2025-01-15T09:00:00Z',
    archived: false
  },
  {
    id: '2',
    name: 'Grilled Chicken Caesar',
    category: 'Salads',
    tags: ['protein', 'healthy'],
    prepTime: 20,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=300&h=200&fit=crop',
    steps: [
      'Season and grill chicken breast',
      'Prepare Caesar dressing',
      'Wash and chop romaine lettuce',
      'Slice grilled chicken',
      'Toss lettuce with dressing',
      'Top with chicken and parmesan'
    ],
    ingredients: [
      { id: '6', name: 'Chicken Breast', quantity: 200, unit: 'g' },
      { id: '7', name: 'Romaine Lettuce', quantity: 150, unit: 'g' },
      { id: '8', name: 'Parmesan', quantity: 50, unit: 'g' }
    ],
    versions: [
      { id: '3', version: 1, changes: 'Initial recipe', createdBy: 'Marcus Rodriguez', createdAt: '2025-01-10T11:00:00Z' }
    ],
    createdBy: 'Marcus Rodriguez',
    createdAt: '2025-01-10T11:00:00Z',
    archived: false
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    items: [
      { recipeId: '1', recipeName: 'Margherita Pizza', quantity: 2, price: 24.00 },
      { recipeId: '2', recipeName: 'Grilled Chicken Caesar', quantity: 1, price: 16.00 }
    ],
    total: 64.00,
    status: 'preparing',
    createdAt: '2025-01-16T18:30:00Z',
    createdBy: 'Sarah Kim'
  },
  {
    id: '2',
    items: [
      { recipeId: '1', recipeName: 'Margherita Pizza', quantity: 1, price: 12.00 }
    ],
    total: 12.00,
    status: 'ready',
    createdAt: '2025-01-16T19:15:00Z',
    createdBy: 'Sarah Kim'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'Tomatoes running low - only 5.2kg remaining',
    ingredient: 'Tomatoes',
    severity: 'high',
    status: 'new',
    createdAt: '2025-01-16T16:45:00Z'
  },
  {
    id: '2',
    type: 'low_stock',
    title: 'Stock Warning',
    message: 'Fresh Basil below threshold - 3 bunches left',
    ingredient: 'Fresh Basil',
    severity: 'medium',
    status: 'acknowledged',
    createdAt: '2025-01-16T14:20:00Z'
  },
  {
    id: '3',
    type: 'usage_spike',
    title: 'Usage Spike',
    message: 'Chicken Breast usage 30% above normal',
    ingredient: 'Chicken Breast',
    severity: 'low',
    status: 'new',
    createdAt: '2025-01-16T12:10:00Z'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    action: 'Recipe Updated',
    entityType: 'recipe',
    entityName: 'Margherita Pizza',
    userId: '2',
    userName: 'Marcus Rodriguez',
    timestamp: '2025-01-16T14:30:00Z',
    changes: { field: 'prepTime', from: 20, to: 25 }
  },
  {
    id: '2',
    action: 'Stock Restocked',
    entityType: 'ingredient',
    entityName: 'Olive Oil',
    userId: '1',
    userName: 'Alice Chen',
    timestamp: '2025-01-16T10:15:00Z',
    changes: { field: 'stock', from: 10.7, to: 15.7 }
  },
  {
    id: '3',
    action: 'Order Placed',
    entityType: 'order',
    entityName: 'Order #1',
    userId: '3',
    userName: 'Sarah Kim',
    timestamp: '2025-01-16T18:30:00Z'
  }
];

// Analytics mock data
export const mockAnalytics = {
  totalRecipes: 24,
  ingredientsInStock: 156,
  activeAlerts: 3,
  ordersToday: 28,
  revenueToday: 1242.50,
  popularRecipes: [
    { name: 'Margherita Pizza', orders: 45 },
    { name: 'Grilled Chicken Caesar', orders: 32 },
    { name: 'Pasta Carbonara', orders: 28 },
    { name: 'Fish Tacos', orders: 21 }
  ],
  stockBurnRate: [
    { date: '2025-01-10', tomatoes: 15, basil: 8, chicken: 22 },
    { date: '2025-01-11', tomatoes: 18, basil: 12, chicken: 25 },
    { date: '2025-01-12', tomatoes: 12, basil: 6, chicken: 19 },
    { date: '2025-01-13', tomatoes: 20, basil: 15, chicken: 28 },
    { date: '2025-01-14', tomatoes: 14, basil: 9, chicken: 23 },
    { date: '2025-01-15', tomatoes: 22, basil: 18, chicken: 31 },
    { date: '2025-01-16', tomatoes: 16, basil: 11, chicken: 26 }
  ]
};