import styled from 'styled-components';
import { Link } from 'react-router-dom';
import type { BaseComponentProps } from '@/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

const Code = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.navy};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.secondary.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const HomeLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary.slate};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: underline;
  &:hover {
    color: ${({ theme }) => theme.colors.primary.slateHover};
  }
`;

interface NotFoundPageProps extends BaseComponentProps {}

export function NotFoundPage(_props: NotFoundPageProps): JSX.Element {
  return (
    <Wrapper data-testid="not-found-page">
      <Code>404</Code>
      <Message>Page not found.</Message>
      <HomeLink to="/" aria-label="Return to dashboard">
        ← Back to Dashboard
      </HomeLink>
    </Wrapper>
  );
}

// Made with Bob
