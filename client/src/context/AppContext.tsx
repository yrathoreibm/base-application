import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AppContextValue, AppState, Item, ViewMode } from '@/types';

const STORAGE_KEY = 'base-app-state';

const defaultState: AppState = {
  items: [],
  selectedItemId: null,
  viewMode: 'grid',
  searchQuery: '',
  isLoading: false,
  error: null,
};

function loadPersistedState(): Pick<AppState, 'viewMode'> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { viewMode: 'grid' };
    const parsed = JSON.parse(raw) as Partial<Pick<AppState, 'viewMode'>>;
    return {
      viewMode: parsed.viewMode === 'list' ? 'list' : 'grid',
    };
  } catch {
    return { viewMode: 'grid' };
  }
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const persisted = useMemo(() => loadPersistedState(), []);

  const [items, setItemsState] = useState<Item[]>(defaultState.items);
  const [selectedItemId, setSelectedItemIdState] = useState<string | null>(
    defaultState.selectedItemId
  );
  const [viewMode, setViewModeState] = useState<ViewMode>(persisted.viewMode);
  const [searchQuery, setSearchQueryState] = useState<string>(defaultState.searchQuery);
  const [isLoading, setIsLoadingState] = useState<boolean>(defaultState.isLoading);
  const [error, setErrorState] = useState<string | null>(defaultState.error);

  // Persist viewMode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ viewMode }));
    } catch {
      // Storage quota exceeded or unavailable — silently ignore
    }
  }, [viewMode]);

  const setSelectedItemId = useCallback((id: string | null) => {
    setSelectedItemIdState(id);
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
  }, []);

  const setItems = useCallback((newItems: Item[]) => {
    setItemsState(newItems);
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    setIsLoadingState(loading);
  }, []);

  const setError = useCallback((err: string | null) => {
    setErrorState(err);
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const value = useMemo<AppContextValue>(
    () => ({
      items,
      selectedItemId,
      viewMode,
      searchQuery,
      isLoading,
      error,
      filteredItems,
      setSelectedItemId,
      setViewMode,
      setSearchQuery,
      setItems,
      setIsLoading,
      setError,
    }),
    [
      items,
      selectedItemId,
      viewMode,
      searchQuery,
      isLoading,
      error,
      filteredItems,
      setSelectedItemId,
      setViewMode,
      setSearchQuery,
      setItems,
      setIsLoading,
      setError,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (ctx === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
}

// Made with Bob
