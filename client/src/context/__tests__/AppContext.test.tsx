import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { AppProvider, useAppContext } from '../AppContext';
import type { Item } from '@/types';

const mockItem: Item = {
  id: '1',
  name: 'Test Item',
  description: 'A test description',
  status: 'active',
  category: 'Test',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

function TestConsumer({
  onRender,
}: {
  onRender: (ctx: ReturnType<typeof useAppContext>) => void;
}): JSX.Element {
  const ctx = useAppContext();
  onRender(ctx);
  return <div>rendered</div>;
}

function renderWithProviders(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}><AppProvider>{ui}</AppProvider></ThemeProvider>);
}

describe('AppProvider / useAppContext', () => {
  it('should throw when used outside AppProvider', () => {
    // Arrange
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    function BrokenConsumer(): JSX.Element {
      useAppContext();
      return <div />;
    }
    // Act & Assert
    expect(() => render(<BrokenConsumer />)).toThrow(
      'useAppContext must be used within an AppProvider'
    );
    spy.mockRestore();
  });

  it('should provide default state', () => {
    // Arrange
    let capturedCtx: ReturnType<typeof useAppContext> | null = null;
    renderWithProviders(
      <TestConsumer
        onRender={(ctx) => {
          capturedCtx = ctx;
        }}
      />
    );
    // Assert
    expect(capturedCtx).not.toBeNull();
    expect(capturedCtx!.items).toEqual([]);
    expect(capturedCtx!.viewMode).toBe('grid');
    expect(capturedCtx!.searchQuery).toBe('');
    expect(capturedCtx!.selectedItemId).toBeNull();
    expect(capturedCtx!.isLoading).toBe(false);
    expect(capturedCtx!.error).toBeNull();
  });

  it('should update items via setItems', async () => {
    // Arrange
    let capturedCtx: ReturnType<typeof useAppContext> | null = null;
    renderWithProviders(
      <TestConsumer
        onRender={(ctx) => {
          capturedCtx = ctx;
        }}
      />
    );
    // Act
    act(() => {
      capturedCtx!.setItems([mockItem]);
    });
    // Assert
    await waitFor(() => {
      expect(capturedCtx!.items).toHaveLength(1);
      expect(capturedCtx!.items[0]?.name).toBe('Test Item');
    });
  });

  it('should update viewMode via setViewMode', async () => {
    // Arrange
    let capturedCtx: ReturnType<typeof useAppContext> | null = null;
    renderWithProviders(
      <TestConsumer
        onRender={(ctx) => {
          capturedCtx = ctx;
        }}
      />
    );
    // Act
    act(() => {
      capturedCtx!.setViewMode('list');
    });
    // Assert
    await waitFor(() => {
      expect(capturedCtx!.viewMode).toBe('list');
    });
  });

  it('should persist viewMode to localStorage', async () => {
    // Arrange
    let capturedCtx: ReturnType<typeof useAppContext> | null = null;
    renderWithProviders(
      <TestConsumer
        onRender={(ctx) => {
          capturedCtx = ctx;
        }}
      />
    );
    // Act
    act(() => {
      capturedCtx!.setViewMode('list');
    });
    // Assert
    await waitFor(() => {
      const stored = localStorage.getItem('base-app-state');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!) as { viewMode: string };
      expect(parsed.viewMode).toBe('list');
    });
  });

  it('should filter items based on searchQuery', async () => {
    // Arrange
    let capturedCtx: ReturnType<typeof useAppContext> | null = null;
    const items: Item[] = [
      { ...mockItem, id: '1', name: 'Alpha Item' },
      { ...mockItem, id: '2', name: 'Beta Item', description: 'totally different' },
    ];
    renderWithProviders(
      <TestConsumer
        onRender={(ctx) => {
          capturedCtx = ctx;
        }}
      />
    );
    act(() => {
      capturedCtx!.setItems(items);
      capturedCtx!.setSearchQuery('alpha');
    });
    // Assert
    await waitFor(() => {
      expect(capturedCtx!.filteredItems).toHaveLength(1);
      expect(capturedCtx!.filteredItems[0]?.name).toBe('Alpha Item');
    });
  });

  it('should return all items when searchQuery is empty', async () => {
    // Arrange
    let capturedCtx: ReturnType<typeof useAppContext> | null = null;
    renderWithProviders(
      <TestConsumer
        onRender={(ctx) => {
          capturedCtx = ctx;
        }}
      />
    );
    act(() => {
      capturedCtx!.setItems([mockItem, { ...mockItem, id: '2', name: 'Another' }]);
      capturedCtx!.setSearchQuery('');
    });
    // Assert
    await waitFor(() => {
      expect(capturedCtx!.filteredItems).toHaveLength(2);
    });
  });

  it('should set and clear error', async () => {
    // Arrange
    let capturedCtx: ReturnType<typeof useAppContext> | null = null;
    renderWithProviders(
      <TestConsumer
        onRender={(ctx) => {
          capturedCtx = ctx;
        }}
      />
    );
    // Act
    act(() => {
      capturedCtx!.setError('Something broke');
    });
    await waitFor(() => {
      expect(capturedCtx!.error).toBe('Something broke');
    });
    act(() => {
      capturedCtx!.setError(null);
    });
    await waitFor(() => {
      expect(capturedCtx!.error).toBeNull();
    });
  });

  it('should set and clear selectedItemId', async () => {
    // Arrange
    let capturedCtx: ReturnType<typeof useAppContext> | null = null;
    renderWithProviders(
      <TestConsumer
        onRender={(ctx) => {
          capturedCtx = ctx;
        }}
      />
    );
    // Act
    act(() => {
      capturedCtx!.setSelectedItemId('abc');
    });
    await waitFor(() => {
      expect(capturedCtx!.selectedItemId).toBe('abc');
    });
    act(() => {
      capturedCtx!.setSelectedItemId(null);
    });
    await waitFor(() => {
      expect(capturedCtx!.selectedItemId).toBeNull();
    });
  });

  it('should load persisted viewMode from localStorage on mount', () => {
    // Arrange — write state before mounting
    localStorage.setItem('base-app-state', JSON.stringify({ viewMode: 'list' }));
    let capturedCtx: ReturnType<typeof useAppContext> | null = null;
    renderWithProviders(
      <TestConsumer
        onRender={(ctx) => {
          capturedCtx = ctx;
        }}
      />
    );
    // Assert
    expect(capturedCtx!.viewMode).toBe('list');
  });

  it('should fall back to default viewMode when localStorage is corrupt', () => {
    // Arrange
    localStorage.setItem('base-app-state', '{ invalid json ');
    let capturedCtx: ReturnType<typeof useAppContext> | null = null;
    renderWithProviders(
      <TestConsumer
        onRender={(ctx) => {
          capturedCtx = ctx;
        }}
      />
    );
    // Assert
    expect(capturedCtx!.viewMode).toBe('grid');
  });

  it('should toggle isLoading', async () => {
    // Arrange
    let capturedCtx: ReturnType<typeof useAppContext> | null = null;
    renderWithProviders(
      <TestConsumer
        onRender={(ctx) => {
          capturedCtx = ctx;
        }}
      />
    );
    // Act
    act(() => {
      capturedCtx!.setIsLoading(true);
    });
    await waitFor(() => {
      expect(capturedCtx!.isLoading).toBe(true);
    });
  });
});

// Made with Bob
