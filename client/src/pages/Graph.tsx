import { useState } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { PageHeader, PageTitle, PageSubtitle, SectionTitle, ItemGrid, ItemName, ItemDescription, ErrorText } from '@/styles/shared';
import { Button } from '@/components/ui/Button';
import { Badge, statusToBadgeVariant } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { GET_ITEMS, GET_ITEM, GET_STATS, DELETE_ITEM } from '@/services/queries';
import type { Item, Stats } from '@/types';

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------
const ConceptBlock = styled.div`
  background: ${({ theme }) => theme.colors.secondary.lightGray};
  border-left: 4px solid ${({ theme }) => theme.colors.primary.slate};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ConceptTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary.navy};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ConceptText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const CodeSnippet = styled.pre`
  background: ${({ theme }) => theme.colors.primary.navy};
  color: #e2e8f0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  overflow-x: auto;
  margin-top: ${({ theme }) => theme.spacing.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const ExampleSection = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ExampleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Tag = styled.span<{ $color?: 'blue' | 'purple' | 'red' }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${({ $color, theme }) =>
    $color === 'purple' ? '#ede9fe' :
    $color === 'red'    ? '#fee2e2' :
    theme.colors.accent.lightBlue};
  color: ${({ $color, theme }) =>
    $color === 'purple' ? '#6d28d9' :
    $color === 'red'    ? '#b91c1c' :
    theme.colors.primary.slate};
`;

const ResultBox = styled.pre`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.secondary.lightGray};
  border: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 280px;
  overflow-y: auto;
`;

const InputRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const InlineInput = styled.input`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
  width: 120px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.slate};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatBox = styled.div`
  background: ${({ theme }) => theme.colors.secondary.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const StatNumber = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.navy};
`;

const StatLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Category = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary.iconGray};
`;

const SuccessText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.accent.successGreen};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function Graph(): JSX.Element {
  // ── Example 1: useQuery — runs automatically on mount ──────────────────
  const { data: statsData, loading: statsLoading, error: statsError } =
    useQuery<{ stats: Stats }>(GET_STATS);

  // ── Example 2: useLazyQuery — runs only on button click ────────────────
  const [fetchItems, { data: itemsData, loading: itemsLoading, error: itemsError }] =
    useLazyQuery<{ items: Item[] }>(GET_ITEMS);

  // ── Example 3: useLazyQuery with variables — fetch a single item by ID ─
  const [itemId, setItemId] = useState('1');
  const [fetchItem, { data: singleItemData, loading: singleLoading, error: singleError }] =
    useLazyQuery<{ item: Item | null }>(GET_ITEM);

  const handleFetchById = (): void => {
    void fetchItem({ variables: { id: itemId } });
  };

  // ── Example 4: useMutation — delete an item ────────────────────────────
  const [deleteId, setDeleteId] = useState('');
  const [deleteResult, setDeleteResult] = useState<string | null>(null);
  const [deleteItem, { loading: deleteLoading, error: deleteError }] =
    useMutation<{ deleteItem: boolean }>(DELETE_ITEM, {
      refetchQueries: [{ query: GET_STATS }],
      onCompleted: (data) => {
        setDeleteResult(data.deleteItem ? 'Item deleted successfully.' : 'Item not found.');
      },
    });

  const handleDelete = (): void => {
    if (!deleteId.trim()) return;
    setDeleteResult(null);
    void deleteItem({ variables: { id: deleteId } });
  };

  return (
    <div data-testid="graph-page">
      <PageHeader>
        <div>
          <PageTitle>GraphQL Explorer</PageTitle>
          <PageSubtitle>
            Live examples of every GraphQL pattern — useQuery, useLazyQuery, variables, and mutations.
          </PageSubtitle>
        </div>
      </PageHeader>

      {/* ── What is GraphQL? ─────────────────────────────────────────────── */}
      <ConceptBlock>
        <ConceptTitle>What is GraphQL?</ConceptTitle>
        <ConceptText>
          GraphQL is a query language for APIs. Instead of calling many REST endpoints, you send
          a single request describing exactly the data shape you need — no more, no less.
          The server (Apollo Server) validates and resolves that query against a typed schema.
        </ConceptText>
        <CodeSnippet>{`# REST — multiple round-trips, fixed response shape
GET /items          → returns ALL fields for ALL items
GET /items/1        → returns ALL fields for one item
GET /stats          → separate request

# GraphQL — one endpoint, you choose the shape
POST /graphql
{ items { id name status } }   ← only the 3 fields you asked for`}</CodeSnippet>
      </ConceptBlock>

      {/* ── Example 1: useQuery ──────────────────────────────────────────── */}
      <ExampleSection aria-labelledby="ex1-heading">
        <ExampleHeader>
          <SectionTitle id="ex1-heading">Example 1 — useQuery (auto-fetch)</SectionTitle>
          <Tag $color="blue">QUERY</Tag>
        </ExampleHeader>

        <ConceptText>
          <strong>useQuery</strong> fires the moment the component mounts. Use it when you always
          need the data on page load. Apollo caches the result — re-navigating to this page won't
          hit the network again.
        </ConceptText>
        <CodeSnippet>{`const { data, loading, error } = useQuery<{ stats: Stats }>(GET_STATS);

// GET_STATS query:
// query GetStats {
//   stats { total active pending inactive }
// }`}</CodeSnippet>

        {statsLoading && <ConceptText>Loading stats…</ConceptText>}
        {statsError && <ErrorText role="alert">{statsError.message}</ErrorText>}
        {statsData?.stats && (
          <StatsGrid>
            <StatBox><StatNumber>{statsData.stats.total}</StatNumber><StatLabel>Total</StatLabel></StatBox>
            <StatBox><StatNumber>{statsData.stats.active}</StatNumber><StatLabel>Active</StatLabel></StatBox>
            <StatBox><StatNumber>{statsData.stats.pending}</StatNumber><StatLabel>Pending</StatLabel></StatBox>
            <StatBox><StatNumber>{statsData.stats.inactive}</StatNumber><StatLabel>Inactive</StatLabel></StatBox>
          </StatsGrid>
        )}
      </ExampleSection>

      {/* ── Example 2: useLazyQuery ──────────────────────────────────────── */}
      <ExampleSection aria-labelledby="ex2-heading">
        <ExampleHeader>
          <SectionTitle id="ex2-heading">Example 2 — useLazyQuery (fetch on demand)</SectionTitle>
          <Tag $color="blue">QUERY</Tag>
        </ExampleHeader>

        <ConceptText>
          <strong>useLazyQuery</strong> gives you a trigger function. The query only runs when
          you call it — perfect for search, button-triggered loads, or conditional fetches.
        </ConceptText>
        <CodeSnippet>{`const [fetchItems, { data, loading, error }] =
  useLazyQuery<{ items: Item[] }>(GET_ITEMS);

// Call it manually:
<Button onClick={() => fetchItems()}>Load Items</Button>`}</CodeSnippet>

        <Button
          onClick={() => void fetchItems()}
          isLoading={itemsLoading}
          aria-label="Fetch all items via GraphQL"
          data-testid="fetch-items-button"
        >
          Load All Items
        </Button>

        {itemsError && <ErrorText role="alert">{itemsError.message}</ErrorText>}
        {itemsData?.items && (
          <ItemGrid data-testid="items-result" style={{ marginTop: '16px' }}>
            {itemsData.items.map((item) => (
              <Card key={item.id} data-testid={`graph-item-${item.id}`}>
                <ItemName>{item.name}</ItemName>
                <ItemDescription>{item.description}</ItemDescription>
                <ItemMeta>
                  <Category>{item.category}</Category>
                  <Badge variant={statusToBadgeVariant(item.status)} label={item.status} />
                </ItemMeta>
              </Card>
            ))}
          </ItemGrid>
        )}
      </ExampleSection>

      {/* ── Example 3: useLazyQuery with variables ───────────────────────── */}
      <ExampleSection aria-labelledby="ex3-heading">
        <ExampleHeader>
          <SectionTitle id="ex3-heading">Example 3 — Query with Variables</SectionTitle>
          <Tag $color="blue">QUERY</Tag>
        </ExampleHeader>

        <ConceptText>
          Variables let you pass dynamic values into a query at runtime without string
          interpolation. Apollo serialises them safely — no injection risk.
        </ConceptText>
        <CodeSnippet>{`const [fetchItem, { data }] = useLazyQuery<{ item: Item }>(GET_ITEM);

// Call with a variable:
fetchItem({ variables: { id: "1" } });

// GET_ITEM query:
// query GetItem($id: ID!) {
//   item(id: $id) { id name description status category }
// }`}</CodeSnippet>

        <InputRow>
          <InlineInput
            type="text"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            placeholder="Item ID"
            aria-label="Item ID to fetch"
            data-testid="item-id-input"
          />
          <Button
            onClick={handleFetchById}
            isLoading={singleLoading}
            aria-label={`Fetch item ${itemId}`}
            data-testid="fetch-single-button"
          >
            Fetch Item
          </Button>
        </InputRow>

        {singleError && <ErrorText role="alert">{singleError.message}</ErrorText>}
        {singleItemData !== undefined && (
          <ResultBox data-testid="single-item-result">
            {JSON.stringify(singleItemData.item, null, 2)}
          </ResultBox>
        )}
      </ExampleSection>

      {/* ── Example 4: useMutation ───────────────────────────────────────── */}
      <ExampleSection aria-labelledby="ex4-heading">
        <ExampleHeader>
          <SectionTitle id="ex4-heading">Example 4 — useMutation (write data)</SectionTitle>
          <Tag $color="purple">MUTATION</Tag>
        </ExampleHeader>

        <ConceptText>
          <strong>useMutation</strong> is used for any write operation — create, update, or delete.
          The <code>refetchQueries</code> option tells Apollo to automatically re-run the stats
          query after the mutation completes, keeping the UI in sync.
        </ConceptText>
        <CodeSnippet>{`const [deleteItem, { loading, error }] = useMutation(DELETE_ITEM, {
  refetchQueries: [{ query: GET_STATS }],   // re-fetch stats after delete
  onCompleted: (data) => console.log(data.deleteItem), // true / false
});

// Call it:
deleteItem({ variables: { id: "2" } });

// DELETE_ITEM mutation:
// mutation DeleteItem($id: ID!) {
//   deleteItem(id: $id)   ← returns Boolean
// }`}</CodeSnippet>

        <InputRow>
          <InlineInput
            type="text"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
            placeholder="Item ID"
            aria-label="Item ID to delete"
            data-testid="delete-id-input"
          />
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={deleteLoading}
            aria-label={`Delete item ${deleteId}`}
            data-testid="delete-item-button"
          >
            Delete Item
          </Button>
        </InputRow>

        {deleteError && <ErrorText role="alert">{deleteError.message}</ErrorText>}
        {deleteResult && (
          <SuccessText data-testid="delete-result">{deleteResult}</SuccessText>
        )}
      </ExampleSection>
    </div>
  );
}

// Made with Bob
