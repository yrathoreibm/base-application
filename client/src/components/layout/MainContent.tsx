import styled from 'styled-components';
import type { BaseComponentProps } from '@/types';

interface MainContentProps extends BaseComponentProps {
  children: React.ReactNode;
}

const Main = styled.main`
  margin-top: 60px;
  margin-left: 340px;
  min-height: calc(100vh - 60px);
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.secondary.lightGray};
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-left: 0;
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) and
    (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export function MainContent({ children, className, 'data-testid': testId }: MainContentProps): JSX.Element {
  return (
    <Main className={className} data-testid={testId ?? 'main-content'}>
      {children}
    </Main>
  );
}

// Made with Bob
