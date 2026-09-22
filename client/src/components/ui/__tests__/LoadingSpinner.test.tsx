import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { LoadingSpinner } from '../LoadingSpinner';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('LoadingSpinner', () => {
  it('should render with default label', () => {
    // Arrange & Act
    renderWithTheme(<LoadingSpinner />);
    // Assert
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('should render with custom label', () => {
    // Arrange & Act
    renderWithTheme(<LoadingSpinner label="Fetching data…" />);
    // Assert
    expect(screen.getByText('Fetching data…')).toBeInTheDocument();
  });

  it('should have role="status" on the spinner ring', () => {
    // Arrange & Act
    renderWithTheme(<LoadingSpinner label="Loading…" />);
    // Assert
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render with data-testid', () => {
    // Arrange & Act
    renderWithTheme(<LoadingSpinner data-testid="my-spinner" />);
    // Assert
    expect(screen.getByTestId('my-spinner')).toBeInTheDocument();
  });

  it('should render with custom size', () => {
    // Arrange & Act
    renderWithTheme(<LoadingSpinner size={60} />);
    // Assert — spinner is rendered (size is a styled prop, not a DOM attribute)
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

// Made with Bob
