/**
 * All TypeScript interfaces and types for the Base Application.
 * Replace the domain types (Item, etc.) with your real entities.
 */

// ---------------------------------------------------------------------------
// Domain
// ---------------------------------------------------------------------------

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

export interface Stats {
  total: number;
  active: number;
  pending: number;
  inactive: number;
}

// ---------------------------------------------------------------------------
// View / UI
// ---------------------------------------------------------------------------

export type ViewMode = 'grid' | 'list';

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface ApiError {
  message: string;
  code: number;
  details?: string;
}

// ---------------------------------------------------------------------------
// App State & Context
// ---------------------------------------------------------------------------

export interface AppState {
  items: Item[];
  selectedItemId: string | null;
  viewMode: ViewMode;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

export interface AppContextValue extends AppState {
  setSelectedItemId: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setItems: (items: Item[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  filteredItems: Item[];
}

// ---------------------------------------------------------------------------
// Utility Types
// ---------------------------------------------------------------------------

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncData<T> = { data: Nullable<T>; loading: boolean; error: Nullable<string> };

// ---------------------------------------------------------------------------
// Component Base Props
// ---------------------------------------------------------------------------

export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
}

// Made with Bob
