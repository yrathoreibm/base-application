import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { Button } from '../Button';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('Button', () => {
  it('should render children text', () => {
    // Arrange & Act
    renderWithTheme(<Button>Click me</Button>);
    // Assert
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    // Arrange
    const handleClick = vi.fn();
    renderWithTheme(<Button onClick={handleClick}>Press</Button>);
    // Act
    fireEvent.click(screen.getByText('Press'));
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    // Arrange & Act
    renderWithTheme(<Button disabled>Disabled</Button>);
    // Assert
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });

  it('should not call onClick when disabled', () => {
    // Arrange
    const handleClick = vi.fn();
    renderWithTheme(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    // Act
    fireEvent.click(screen.getByText('Disabled'));
    // Assert
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should show spinner and be disabled when isLoading is true', () => {
    // Arrange & Act
    renderWithTheme(<Button isLoading>Loading</Button>);
    const btn = screen.getByRole('button', { name: 'Loading' });
    // Assert
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('should apply aria-label when provided', () => {
    // Arrange & Act
    renderWithTheme(<Button aria-label="Save item">Save</Button>);
    // Assert
    expect(screen.getByRole('button', { name: 'Save item' })).toBeInTheDocument();
  });

  it('should render with data-testid', () => {
    // Arrange & Act
    renderWithTheme(<Button data-testid="my-btn">Test</Button>);
    // Assert
    expect(screen.getByTestId('my-btn')).toBeInTheDocument();
  });

  it('should render secondary variant', () => {
    // Arrange & Act
    renderWithTheme(<Button variant="secondary">Secondary</Button>);
    // Assert
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });

  it('should render danger variant', () => {
    // Arrange & Act
    renderWithTheme(<Button variant="danger">Delete</Button>);
    // Assert
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should render ghost variant', () => {
    // Arrange & Act
    renderWithTheme(<Button variant="ghost">Ghost</Button>);
    // Assert
    expect(screen.getByText('Ghost')).toBeInTheDocument();
  });

  it('should render submit type', () => {
    // Arrange & Act
    renderWithTheme(<Button type="submit">Submit</Button>);
    // Assert
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});

// Made with Bob
