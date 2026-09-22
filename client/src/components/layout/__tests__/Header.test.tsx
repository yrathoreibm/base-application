import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import { theme } from '@/styles/theme';
import { Header } from '../Header';
import { AppProvider } from '@/context/AppContext';

function renderHeader(onToggleSidebar?: () => void) {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <AppProvider>
          <Header onToggleSidebar={onToggleSidebar} />
        </AppProvider>
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('Header', () => {
  it('should render the application logo', () => {
    // Arrange & Act
    renderHeader();
    // Assert
    expect(screen.getByText('Base Application')).toBeInTheDocument();
  });

  it('should render the search input', () => {
    // Arrange & Act
    renderHeader();
    // Assert
    expect(screen.getByPlaceholderText('Search items…')).toBeInTheDocument();
  });

  it('should have correct aria-label on search input', () => {
    // Arrange & Act
    renderHeader();
    // Assert
    expect(screen.getByRole('searchbox', { name: 'Search items' })).toBeInTheDocument();
  });

  it('should show hamburger button when onToggleSidebar is provided', () => {
    // Arrange & Act
    renderHeader(vi.fn());
    // Assert
    expect(screen.getByRole('button', { name: 'Toggle sidebar navigation' })).toBeInTheDocument();
  });

  it('should not show hamburger button when onToggleSidebar is not provided', () => {
    // Arrange & Act
    renderHeader();
    // Assert
    expect(
      screen.queryByRole('button', { name: 'Toggle sidebar navigation' })
    ).not.toBeInTheDocument();
  });

  it('should call onToggleSidebar when hamburger is clicked', () => {
    // Arrange
    const toggle = vi.fn();
    renderHeader(toggle);
    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Toggle sidebar navigation' }));
    // Assert
    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it('should render with default data-testid', () => {
    // Arrange & Act
    renderHeader();
    // Assert
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});

// Made with Bob
