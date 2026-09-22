import { useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { GET_ITEMS, CREATE_ITEM, DELETE_ITEM } from '@/services/queries';
import { Card } from '@/components/ui/Card';
import { Badge, statusToBadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Item, ItemStatus } from '@/types';

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------
const createItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120, 'Name is too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description is too long'),
  status: z.enum(['pending', 'active', 'inactive'] as const),
  category: z.string().min(1, 'Category is required'),
});

type CreateItemFormData = z.infer<typeof createItemSchema>;

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------
const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
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
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
`;

const Input = styled.input`
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

const TextArea = styled.textarea`
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

const Select = styled.select`
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

const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.accent.errorRed};
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ItemsPage(): JSX.Element {
  const { setItems, filteredItems } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { loading } = useQuery<{ items: Item[] }>(GET_ITEMS, {
    onCompleted: (data) => setItems(data.items),
  });

  const [createItem, { loading: creating }] = useMutation<
    { createItem: Item },
    { input: CreateItemFormData }
  >(CREATE_ITEM, {
    refetchQueries: [{ query: GET_ITEMS }],
    onCompleted: () => {
      setIsModalOpen(false);
      reset();
    },
  });

  const [deleteItem] = useMutation<{ deleteItem: boolean }, { id: string }>(DELETE_ITEM, {
    refetchQueries: [{ query: GET_ITEMS }],
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: { status: 'pending' },
  });

  const onSubmit = async (data: CreateItemFormData): Promise<void> => {
    await createItem({ variables: { input: data } });
  };

  const handleDelete = async (id: string): Promise<void> => {
    await deleteItem({ variables: { id } });
  };

  if (loading) return <LoadingSpinner label="Loading items…" />;

  return (
    <div data-testid="items-page">
      <PageHeader>
        <PageTitle>Items</PageTitle>
        <Button
          onClick={() => setIsModalOpen(true)}
          aria-label="Add new item"
          data-testid="add-item-button"
        >
          + Add Item
        </Button>
      </PageHeader>

      {filteredItems.length === 0 ? (
        <EmptyState
          title="No items yet"
          message="Click 'Add Item' to create your first item."
          action={
            <Button onClick={() => setIsModalOpen(true)} aria-label="Add first item">
              + Add Item
            </Button>
          }
        />
      ) : (
        <ItemGrid>
          {filteredItems.map((item) => (
            <Card key={item.id} data-testid={`item-card-${item.id}`}>
              <ItemName>{item.name}</ItemName>
              <ItemDescription>{item.description}</ItemDescription>
              <CardFooter>
                <Badge variant={statusToBadgeVariant(item.status)} label={item.status} />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => void handleDelete(item.id)}
                  aria-label={`Delete ${item.name}`}
                  data-testid={`delete-item-${item.id}`}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </ItemGrid>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Add New Item"
        data-testid="create-item-modal"
      >
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} noValidate>
          <FormGroup>
            <Label htmlFor="item-name">Name</Label>
            <Input
              id="item-name"
              type="text"
              placeholder="Item name"
              aria-describedby={errors.name ? 'name-error' : undefined}
              {...register('name')}
            />
            {errors.name && (
              <ErrorText id="name-error" role="alert">
                {errors.name.message}
              </ErrorText>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="item-description">Description</Label>
            <TextArea
              id="item-description"
              placeholder="Item description"
              aria-describedby={errors.description ? 'description-error' : undefined}
              {...register('description')}
            />
            {errors.description && (
              <ErrorText id="description-error" role="alert">
                {errors.description.message}
              </ErrorText>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="item-status">Status</Label>
            <Select
              id="item-status"
              aria-label="Select item status"
              {...register('status')}
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="item-category">Category</Label>
            <Input
              id="item-category"
              type="text"
              placeholder="Category"
              aria-describedby={errors.category ? 'category-error' : undefined}
              {...register('category')}
            />
            {errors.category && (
              <ErrorText id="category-error" role="alert">
                {errors.category.message}
              </ErrorText>
            )}
          </FormGroup>

          <ModalActions>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={creating}
              aria-label="Save new item"
              data-testid="save-item-button"
            >
              Save
            </Button>
          </ModalActions>
        </form>
      </Modal>
    </div>
  );
}

// Made with Bob
