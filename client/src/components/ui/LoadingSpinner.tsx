import styled, { keyframes } from 'styled-components';
import type { BaseComponentProps } from '@/types';

interface LoadingSpinnerProps extends BaseComponentProps {
  size?: number;
  label?: string;
}

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const SpinnerRing = styled.div<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: 3px solid ${({ theme }) => theme.colors.secondary.borderGray};
  border-top-color: ${({ theme }) => theme.colors.primary.slate};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const SpinnerLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary.textSecondary};
`;

export function LoadingSpinner({
  size = 40,
  label = 'Loading…',
  className,
  'data-testid': testId,
}: LoadingSpinnerProps): JSX.Element {
  return (
    <SpinnerWrapper className={className} data-testid={testId ?? 'loading-spinner'}>
      <SpinnerRing $size={size} role="status" aria-label={label} />
      <SpinnerLabel aria-live="polite">{label}</SpinnerLabel>
    </SpinnerWrapper>
  );
}

// Made with Bob
