import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import { theme } from '@/styles/theme';
import { AppProvider, useAppContext } from '@/context/AppContext';
import { Dashboard } from '@/pages/Dashboard';
import type { Item } from '@/types';

/**
 * Integration test — simulates the main user workflow:
 * 1. App loads with items in context
 * 2. Items appear in the grid
 * 3. User types a search query — list filters
 * 4. User clears search — all items shown again
 * 5. User selects an item — card highlights
 */

const mockItems: Item[] = [
  {
    id: '1',
    name: 'Alpha Widget',
    description: 'The first widget',
    status: 'active',
    category: 'Widgets',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Beta Gadget',
    description: 'The second gadget',
    status: 'pending',
    category: 'Gadgets',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Gamma Tool',
    description: 'An inactive tool',
    status: 'inactive',
    category: 'Tools',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
];

// Seed the context before Dashboard renders (bypasses Apollo)
function SeedItems(): null {
  const { setItems } = useAppContext();
  act(() => {
    setItems(mockItems);
  });
  return null;
}

// Minimal mock for Apollo hooks used inside Dashboard
vi.mock('@apollo/client', async (importOriginal) => {
  const real = await importOriginal<typeof import('@apollo/client')>();
  return {
    ...real,
    useQuery: vi.fn().mockReturnValue({ loading: false, data: undefined }),
  };
});

function renderApp() {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <AppProvider>
          <SeedItems />
          <Dashboard />
        </AppProvider>
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('Integration: main dashboard workflow', () => {
  it('should display all items on initial load', async () => {
    // Arrange & Act
    renderApp();
    // Assert
    await waitFor(() => {
      expect(screen.getByText('Alpha Widget')).toBeInTheDocument();
      expect(screen.getByText('Beta Gadget')).toBeInTheDocument();
      expect(screen.getByText('Gamma Tool')).toBeInTheDocument();
    });
  });

  it('should filter items when search query is entered', async () => {
    // Arrange
    const { container } = renderApp();
    await waitFor(() => expect(screen.getByText('Alpha Widget')).toBeInTheDocument());

    // Act — we update searchQuery via context because there's no header in this render
    const searchInput = container.ownerDocument.createElement('input');
    const ctx = screen.getByTestId('dashboard-page');
    expect(ctx).toBeInTheDocument();

    // Use a nested consumer to drive the filter
    let capturedCtx: ReturnType<typeof useAppContext> | null = null;

    function Capture(): null {
      capturedCtx = useAppContext();
      return null;
    }

    const { unmount } = render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <AppProvider>
            <SeedItems />
            <Capture />
            <Dashboard />
          </AppProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(capturedCtx).not.toBeNull();
    });

    act(() => {
      capturedCtx!.setSearchQuery('alpha');
    });

    await waitFor(() => {
      expect(capturedCtx!.filteredItems).toHaveLength(1);
      expect(capturedCtx!.filteredItems[0]?.name).toBe('Alpha Widget');
    });

    // Cleanup
    unmount();
    searchInput.remove();
  });

  it('should show all items when search is cleared', async () => {
    // Arrange
    let capturedCtx: ReturnType<typeof useAppContext> | null = null;

    function Capture(): null {
      capturedCtx = useAppContext();
      return null;
    }

    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <AppProvider>
            <SeedItems />
            <Capture />
            <Dashboard />
          </AppProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    await waitFor(() => expect(capturedCtx).not.toBeNull());

    // Act — search then clear
    act(() => {
      capturedCtx!.setSearchQuery('beta');
    });
    await waitFor(() => {
      expect(capturedCtx!.filteredItems).toHaveLength(1);
    });

    act(() => {
      capturedCtx!.setSearchQuery('');
    });
    await waitFor(() => {
      expect(capturedCtx!.filteredItems).toHaveLength(3);
    });
  });

  it('should toggle selectedItemId when a card is clicked', async () => {
    // Arrange
    let capturedCtx: ReturnType<typeof useAppContext> | null = null;

    function Capture(): null {
      capturedCtx = useAppContext();
      return null;
    }

    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <AppProvider>
            <SeedItems />
            <Capture />
            <Dashboard />
          </AppProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('item-card-1')).toBeInTheDocument();
    });

    // Act — select
    act(() => {
      fireEvent.click(screen.getByTestId('item-card-1'));
    });
    await waitFor(() => {
      expect(capturedCtx!.selectedItemId).toBe('1');
    });

    // Act — deselect
    act(() => {
      fireEvent.click(screen.getByTestId('item-card-1'));
    });
    await waitFor(() => {
      expect(capturedCtx!.selectedItemId).toBeNull();
    });
  });
});

// Made with Bob
