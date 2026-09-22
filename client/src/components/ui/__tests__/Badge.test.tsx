import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { Badge, statusToBadgeVariant } from '../Badge';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('Badge', () => {
  it('should render the label text', () => {
    // Arrange & Act
    renderWithTheme(<Badge label="active" />);
    // Assert
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('should have correct aria-label', () => {
    // Arrange & Act
    renderWithTheme(<Badge label="pending" />);
    // Assert
    expect(screen.getByLabelText('Status: pending')).toBeInTheDocument();
  });

  it('should render with data-testid', () => {
    // Arrange & Act
    renderWithTheme(<Badge label="test" data-testid="my-badge" />);
    // Assert
    expect(screen.getByTestId('my-badge')).toBeInTheDocument();
  });

  it('should render success variant', () => {
    // Arrange & Act
    renderWithTheme(<Badge label="active" variant="success" />);
    // Assert
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('should render warning variant', () => {
    // Arrange & Act
    renderWithTheme(<Badge label="pending" variant="warning" />);
    // Assert
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('should render error variant', () => {
    // Arrange & Act
    renderWithTheme(<Badge label="inactive" variant="error" />);
    // Assert
    expect(screen.getByText('inactive')).toBeInTheDocument();
  });

  it('should render default variant when no variant is provided', () => {
    // Arrange & Act
    renderWithTheme(<Badge label="unknown" />);
    // Assert
    expect(screen.getByText('unknown')).toBeInTheDocument();
  });
});

describe('statusToBadgeVariant', () => {
  it('should return success for active', () => {
    expect(statusToBadgeVariant('active')).toBe('success');
  });

  it('should return warning for pending', () => {
    expect(statusToBadgeVariant('pending')).toBe('warning');
  });

  it('should return error for inactive', () => {
    expect(statusToBadgeVariant('inactive')).toBe('error');
  });

  it('should return default for unknown status', () => {
    expect(statusToBadgeVariant('unknown')).toBe('default');
  });
});

// Made with Bob
