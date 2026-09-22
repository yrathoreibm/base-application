/**
 * Domain model interfaces for the Base Application.
 * The application domain is a generic "Item" management system —
 * replace these types with your real domain entities.
 */

export type ItemStatus = 'pending' | 'active' | 'inactive';

export interface Item {
  id: string;
  name: string;
  description: string;
  status: ItemStatus;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemInput {
  name: string;
  description: string;
  status: ItemStatus;
  category: string;
}

export interface UpdateItemInput {
  name?: string;
  description?: string;
  status?: ItemStatus;
  category?: string;
}

// Made with Bob
