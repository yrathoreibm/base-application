import styled from 'styled-components';
import { useAppContext } from '@/context/AppContext';
import type { BaseComponentProps } from '@/types';

interface HeaderProps extends BaseComponentProps {
  onToggleSidebar?: () => void;
}

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.primary.navy};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Logo = styled.span`
  color: ${({ theme }) => theme.colors.secondary.white};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  letter-spacing: 0.02em;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SearchInput = styled.input`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme }) => theme.colors.primary.slateHover};
  background: ${({ theme }) => theme.colors.primary.slate};
  color: ${({ theme }) => theme.colors.secondary.white};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  width: 240px;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary.borderGray};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary.white};
  }
`;

const HamburgerButton = styled.button`
  color: ${({ theme }) => theme.colors.secondary.white};
  font-size: 22px;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: background ${({ theme }) => theme.transitions.fast};
  display: none;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.slateHover};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: block;
  }
`;

export function Header({ className, 'data-testid': testId, onToggleSidebar }: HeaderProps): JSX.Element {
  const { searchQuery, setSearchQuery } = useAppContext();

  return (
    <HeaderWrapper className={className} data-testid={testId ?? 'header'}>
      <Logo>Base Application</Logo>
      <Controls>
        <SearchInput
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search items…"
          aria-label="Search items"
        />
        {onToggleSidebar && (
          <HamburgerButton
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar navigation"
          >
            ☰
          </HamburgerButton>
        )}
      </Controls>
    </HeaderWrapper>
  );
}

// Made with Bob
