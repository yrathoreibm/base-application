import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import type { BaseComponentProps } from '@/types';

interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  titleId?: string;
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
`;

const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.secondary.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  flex: 1;
`;

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  'data-testid': testId,
  titleId = 'modal-title',
}: ModalProps): JSX.Element | null {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <Backdrop
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-testid={testId ?? 'modal-backdrop'}
    >
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={className}
        data-testid="modal-dialog"
      >
        <ModalHeader>
          <ModalTitle id={titleId}>{title}</ModalTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
            data-testid="modal-close-button"
          >
            ✕
          </Button>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </Dialog>
    </Backdrop>
  );
}

// Made with Bob
