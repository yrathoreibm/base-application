import styled, { css } from 'styled-components';
import type { BaseComponentProps } from '@/types';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  'aria-label'?: string;
}

const sizeStyles = {
  sm: css`
    padding: 4px 12px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  `,
  md: css`
    padding: 8px 20px;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  `,
  lg: css`
    padding: 12px 28px;
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  `,
};

const variantStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary.slate};
    color: ${({ theme }) => theme.colors.secondary.white};
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primary.slateHover};
    }
    &:active:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primary.slateActive};
    }
  `,
  secondary: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary.slate};
    border: 1px solid ${({ theme }) => theme.colors.primary.slate};
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.accent.lightBlue};
    }
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.accent.errorRed};
    color: ${({ theme }) => theme.colors.secondary.white};
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.secondary.textSecondary};
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.accent.hoverGray};
      color: ${({ theme }) => theme.colors.secondary.textPrimary};
    }
  `,
};

const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast},
    opacity ${({ theme }) => theme.transitions.fast};
  border: none;
  white-space: nowrap;
  user-select: none;

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.slate};
    outline-offset: 2px;
  }
`;

const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  children,
  className,
  'data-testid': testId,
  'aria-label': ariaLabel,
}: ButtonProps): JSX.Element {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
      className={className}
      data-testid={testId ?? 'button'}
      aria-label={ariaLabel}
      aria-busy={isLoading}
    >
      {isLoading && <Spinner aria-hidden="true" />}
      {children}
    </StyledButton>
  );
}

// Made with Bob
