import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { Modal } from '../Modal';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('Modal', () => {
  it('should render when isOpen is true', () => {
    // Arrange & Act
    renderWithTheme(
      <Modal isOpen title="Test Modal" onClose={vi.fn()}>
        Modal body
      </Modal>
    );
    // Assert
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    // Arrange & Act
    renderWithTheme(
      <Modal isOpen={false} title="Hidden Modal" onClose={vi.fn()}>
        Content
      </Modal>
    );
    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    // Arrange
    const onClose = vi.fn();
    renderWithTheme(
      <Modal isOpen title="Close Test" onClose={onClose}>
        Content
      </Modal>
    );
    // Act
    fireEvent.click(screen.getByTestId('modal-close-button'));
    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Escape key is pressed', () => {
    // Arrange
    const onClose = vi.fn();
    renderWithTheme(
      <Modal isOpen title="Escape Test" onClose={onClose}>
        Content
      </Modal>
    );
    // Act
    fireEvent.keyDown(document, { key: 'Escape' });
    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', () => {
    // Arrange
    const onClose = vi.fn();
    renderWithTheme(
      <Modal isOpen title="Backdrop Test" onClose={onClose}>
        Content
      </Modal>
    );
    // Act — click the backdrop (data-testid="modal-backdrop")
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should have aria-modal="true" and aria-labelledby', () => {
    // Arrange & Act
    renderWithTheme(
      <Modal isOpen title="Aria Test" onClose={vi.fn()} titleId="custom-title">
        Content
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    // Assert
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'custom-title');
  });
});

// Made with Bob
