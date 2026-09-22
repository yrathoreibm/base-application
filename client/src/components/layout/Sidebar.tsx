import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import type { BaseComponentProps } from '@/types';

interface SidebarProps extends BaseComponentProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SidebarWrapper = styled.nav<{ $isOpen: boolean }>`
  position: fixed;
  top: 60px;
  left: 0;
  width: 340px;
  height: calc(100vh - 60px);
  background-color: ${({ theme }) => theme.colors.secondary.white};
  border-right: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  transition: transform ${({ theme }) => theme.transitions.normal};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  }
`;

const NavSection = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.secondary.iconGray};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const activeStyle = css`
  background-color: ${({ theme }) => theme.colors.accent.lightBlue};
  color: ${({ theme }) => theme.colors.primary.slate};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary.textSecondary};
  transition: background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent.hoverGray};
    color: ${({ theme }) => theme.colors.secondary.textPrimary};
  }

  &.active {
    ${activeStyle}
  }
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: ${({ theme }) => theme.zIndex.sticky - 1};
  }
`;

export function Sidebar({ className, 'data-testid': testId, isOpen = true, onClose }: SidebarProps): JSX.Element {
  return (
    <>
      {!isOpen && onClose && <Overlay onClick={onClose} aria-hidden="true" />}
      <SidebarWrapper
        $isOpen={isOpen}
        className={className}
        data-testid={testId ?? 'sidebar'}
        aria-label="Main navigation"
      >
        <NavSection>
          <SectionTitle>Navigation</SectionTitle>
          <StyledNavLink to="/" end aria-label="Go to dashboard">
            📊 Dashboard
          </StyledNavLink>
          <StyledNavLink to="/items" aria-label="Go to items list">
            📋 Items
          </StyledNavLink>
          {/* Place, Graph, Hooks nav links hidden for demo — routes and files intact */}
        </NavSection>
      </SidebarWrapper>
    </>
  );
}

// Made with Bob
