import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { MainContent } from '../MainContent';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('MainContent', () => {
  it('should render children', () => {
    // Arrange & Act
    renderWithTheme(<MainContent>Page content here</MainContent>);
    // Assert
    expect(screen.getByText('Page content here')).toBeInTheDocument();
  });

  it('should render with default data-testid', () => {
    // Arrange & Act
    renderWithTheme(<MainContent>Content</MainContent>);
    // Assert
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  it('should render with custom data-testid', () => {
    // Arrange & Act
    renderWithTheme(<MainContent data-testid="custom-main">Content</MainContent>);
    // Assert
    expect(screen.getByTestId('custom-main')).toBeInTheDocument();
  });

  it('should render a main element', () => {
    // Arrange & Act
    renderWithTheme(<MainContent>Content</MainContent>);
    // Assert
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});

// Made with Bob
