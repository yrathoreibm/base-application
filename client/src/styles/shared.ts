/**
 * Shared styled-components primitives reused across pages.
 *
 * Import from here instead of redeclaring the same component in each page:
 *   import { PageHeader, PageTitle, ItemGrid, ... } from '@/styles/shared';
 *
 * Only truly cross-page components live here. Component-specific styles
 * (e.g. Modal internals, Button variants) stay in their own files.
 */
import styled from 'styled-components';

// ---------------------------------------------------------------------------
// Page layout
// ---------------------------------------------------------------------------

/** Top section of a page — flex row, space-between, wraps on small screens. */
export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

/** Main <h1> for a page. */
export const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
`;

/** Muted subtitle line beneath a page title. */
export const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.secondary.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

/** <h2> section heading inside a page. */
export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

// ---------------------------------------------------------------------------
// Item grid + card internals
// ---------------------------------------------------------------------------

/** Responsive auto-fill grid for item cards. */
export const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

/** Item card <h3> name. */
export const ItemName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

/** Item card description paragraph. */
export const ItemDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

// ---------------------------------------------------------------------------
// Form primitives  (used in ItemsPage modal, reusable anywhere)
// ---------------------------------------------------------------------------

/** Vertical field group: label + input + error. */
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

/** Form field label. */
export const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
`;

/** Standard text input. */
export const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.slate};
  }
`;

/** Multi-line textarea, vertically resizable. */
export const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
  resize: vertical;
  min-height: 80px;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.slate};
  }
`;

/** Dropdown select. */
export const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: inherit;
  background: ${({ theme }) => theme.colors.secondary.white};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.slate};
  }
`;

/** Inline validation error message below a field. */
export const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.accent.errorRed};
`;

// Made with Bob
