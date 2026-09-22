import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { EmptyState } from '../EmptyState';
import { Button } from '../Button';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('EmptyState', () => {
  it('should render with default title and message', () => {
    // Arrange & Act
    renderWithTheme(<EmptyState />);
    // Assert
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    expect(screen.getByText('Add your first item to get started.')).toBeInTheDocument();
  });

  it('should render with custom title and message', () => {
    // Arrange & Act
    renderWithTheme(<EmptyState title="No results" message="Try a different search." />);
    // Assert
    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.getByText('Try a different search.')).toBeInTheDocument();
  });

  it('should render action slot when provided', () => {
    // Arrange
    const handleClick = vi.fn();
    renderWithTheme(
      <EmptyState
        action={
          <Button onClick={handleClick} aria-label="Add new">
            Add New
          </Button>
        }
      />
    );
    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Add new' }));
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not render action slot when not provided', () => {
    // Arrange & Act
    renderWithTheme(<EmptyState />);
    // Assert
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should have role="status"', () => {
    // Arrange & Act
    renderWithTheme(<EmptyState />);
    // Assert
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render with data-testid', () => {
    // Arrange & Act
    renderWithTheme(<EmptyState data-testid="my-empty" />);
    // Assert
    expect(screen.getByTestId('my-empty')).toBeInTheDocument();
  });
});

// Made with Bob
