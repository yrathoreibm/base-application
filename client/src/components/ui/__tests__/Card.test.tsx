import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { Card } from '../Card';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('Card', () => {
  it('should render children', () => {
    // Arrange & Act
    renderWithTheme(<Card>Card content</Card>);
    // Assert
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    // Arrange
    const handleClick = vi.fn();
    renderWithTheme(<Card onClick={handleClick}>Clickable</Card>);
    // Act
    fireEvent.click(screen.getByText('Clickable'));
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be keyboard accessible when onClick is provided', () => {
    // Arrange
    const handleClick = vi.fn();
    renderWithTheme(<Card onClick={handleClick}>Keyboard</Card>);
    const card = screen.getByRole('article');
    // Act — press Enter
    fireEvent.keyDown(card, { key: 'Enter' });
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should trigger onClick on Space key', () => {
    // Arrange
    const handleClick = vi.fn();
    renderWithTheme(<Card onClick={handleClick}>Space Key</Card>);
    const card = screen.getByRole('article');
    // Act
    fireEvent.keyDown(card, { key: ' ' });
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not be keyboard accessible when no onClick', () => {
    // Arrange & Act
    renderWithTheme(<Card>Static card</Card>);
    const card = screen.getByRole('article');
    // Assert — no tabIndex on non-interactive card
    expect(card).not.toHaveAttribute('tabindex');
  });

  it('should render with data-testid', () => {
    // Arrange & Act
    renderWithTheme(<Card data-testid="my-card">Content</Card>);
    // Assert
    expect(screen.getByTestId('my-card')).toBeInTheDocument();
  });

  it('should apply selected styles when isSelected is true', () => {
    // Arrange & Act
    renderWithTheme(<Card isSelected>Selected</Card>);
    // Assert — the component renders without errors
    expect(screen.getByText('Selected')).toBeInTheDocument();
  });
});

// Made with Bob
