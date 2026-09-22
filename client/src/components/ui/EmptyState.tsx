import styled from 'styled-components';
import type { BaseComponentProps } from '@/types';

interface EmptyStateProps extends BaseComponentProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary.textSecondary};
`;

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 360px;
`;

const ActionWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export function EmptyState({
  title = 'Nothing here yet',
  message = 'Add your first item to get started.',
  action,
  className,
  'data-testid': testId,
}: EmptyStateProps): JSX.Element {
  return (
    <Wrapper className={className} data-testid={testId ?? 'empty-state'} role="status">
      <Icon aria-hidden="true">📭</Icon>
      <Title>{title}</Title>
      <Message>{message}</Message>
      {action && <ActionWrapper>{action}</ActionWrapper>}
    </Wrapper>
  );
}

// Made with Bob
