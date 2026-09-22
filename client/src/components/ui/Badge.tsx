import styled from 'styled-components';
import type { BaseComponentProps } from '@/types';

type BadgeVariant = 'success' | 'warning' | 'error' | 'default';

interface BadgeProps extends BaseComponentProps {
  variant?: BadgeVariant;
  label: string;
}

const variantMap: Record<BadgeVariant, { bg: string; color: string }> = {
  success: { bg: '#E8F5E9', color: '#2E7D32' },
  warning: { bg: '#FFF8E1', color: '#F57F17' },
  error: { bg: '#FFEBEE', color: '#C62828' },
  default: { bg: '#F5F5F5', color: '#616161' },
};

const StyledBadge = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  letter-spacing: 0.04em;
  background-color: ${({ $variant }) => variantMap[$variant].bg};
  color: ${({ $variant }) => variantMap[$variant].color};
  white-space: nowrap;
`;

export function statusToBadgeVariant(status: string): BadgeVariant {
  if (status === 'active') return 'success';
  if (status === 'pending') return 'warning';
  if (status === 'inactive') return 'error';
  return 'default';
}

export function Badge({
  variant = 'default',
  label,
  className,
  'data-testid': testId,
}: BadgeProps): JSX.Element {
  return (
    <StyledBadge
      $variant={variant}
      className={className}
      data-testid={testId ?? 'badge'}
      aria-label={`Status: ${label}`}
    >
      {label}
    </StyledBadge>
  );
}

// Made with Bob
