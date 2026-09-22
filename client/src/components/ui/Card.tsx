import styled from 'styled-components';
import type { BaseComponentProps } from '@/types';

interface CardProps extends BaseComponentProps {
  children: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
}

const StyledCard = styled.article<{ $clickable: boolean; $isSelected: boolean }>`
  background-color: ${({ theme }) => theme.colors.secondary.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid
    ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primary.slate : theme.colors.secondary.borderGray};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme, $isSelected }) => ($isSelected ? theme.shadows.md : theme.shadows.sm)};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: box-shadow ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};

  ${({ $clickable, theme }) =>
    $clickable &&
    `
    &:hover {
      box-shadow: ${theme.shadows.md};
      transform: translateY(-1px);
    }
    &:active {
      transform: translateY(0);
    }
  `}
`;

export function Card({
  children,
  onClick,
  isSelected = false,
  className,
  'data-testid': testId,
}: CardProps): JSX.Element {
  return (
    <StyledCard
      $clickable={!!onClick}
      $isSelected={isSelected}
      onClick={onClick}
      className={className}
      data-testid={testId ?? 'card'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </StyledCard>
  );
}

// Made with Bob
