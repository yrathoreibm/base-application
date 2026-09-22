import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { useAppContext } from '@/context/AppContext';
import { GET_ITEMS, GET_STATS } from '@/services/queries';
import { Card } from '@/components/ui/Card';
import { Badge, statusToBadgeVariant } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Item, Stats } from '@/types';
import {useState} from 'react';

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.secondary.textSecondary};
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.secondary.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const StatNumber = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.navy};
`;

const StatLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const ItemName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ItemDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
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

export function Dashboard(): JSX.Element {
  // const [initial, setInitial] = useState(false);

  const { setItems, setIsLoading, setError, filteredItems, selectedItemId, setSelectedItemId } =
    useAppContext();

  const { loading: itemsLoading } = useQuery<{ items: Item[] }>(GET_ITEMS, {
    onCompleted: (data) => {
      setItems(data.items);
      setIsLoading(false);
    },
    onError: (err) => {
      setError(err.message);
      setIsLoading(false);
    },
  });

  const { data: statsData } = useQuery<{ stats: Stats }>(GET_STATS);
  const stats = statsData?.stats;

  if (itemsLoading) {
    return <LoadingSpinner label="Loading dashboard…" />;
  }

  return (
    <div data-testid="dashboard-page">
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
        <PageSubtitle>Overview of all items in the base application.</PageSubtitle>
      </PageHeader>

      {stats && (
        <StatsRow>
          <StatCard>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.active}</StatNumber>
            <StatLabel>Active</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.pending}</StatNumber>
            <StatLabel>Pending</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.inactive}</StatNumber>
            <StatLabel>Inactive</StatLabel>
          </StatCard>
        </StatsRow>
      )}

      <SectionTitle>Recent Items</SectionTitle>

      {filteredItems.length === 0 ? (
        <EmptyState
          title="No items found"
          message="No items match your current search."
        />
      ) : (
        <ItemGrid>
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              isSelected={selectedItemId === item.id}
              onClick={() => {
                // setInitial(true);
                // console.log(initial)
                return setSelectedItemId(selectedItemId === item.id ? null : item.id)
              }}
              data-testid={`item-card-${item.id}`}
            >
              <ItemMeta>
                <Category>{item.category}</Category>
                <Badge
                  variant={statusToBadgeVariant(item.status)}
                  label={item.status}
                />
              </ItemMeta>
              <ItemName>{item.name}</ItemName>
              <ItemDescription>{item.description}</ItemDescription>
            </Card>
          ))}
        </ItemGrid>
      )}
    </div>
  );
}

// Made with Bob
