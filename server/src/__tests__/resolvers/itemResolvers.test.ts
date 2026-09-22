import { itemResolvers } from '../../resolvers/itemResolvers';
import { itemService } from '../../services/itemService';
import type { CreateItemInput } from '../../models/item';

// Spy on the service to isolate resolver logic
jest.mock('../../services/itemService');

const mockedService = itemService as jest.Mocked<typeof itemService>;

const mockItem = {
  id: '1',
  name: 'Test Item',
  description: 'Desc',
  status: 'active' as const,
  category: 'General',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('Query.items', () => {
  it('should return all items from the service', async () => {
    // Arrange
    mockedService.getAll.mockResolvedValue([mockItem]);
    // Act
    const result = await itemResolvers.Query.items();
    // Assert
    expect(result).toEqual([mockItem]);
    expect(mockedService.getAll).toHaveBeenCalledTimes(1);
  });
});

describe('Query.item', () => {
  it('should return item by id', async () => {
    // Arrange
    mockedService.getById.mockResolvedValue(mockItem);
    // Act
    const result = await itemResolvers.Query.item(undefined, { id: '1' });
    // Assert
    expect(result).toEqual(mockItem);
  });

  it('should throw BAD_USER_INPUT when id is empty', async () => {
    // Act & Assert
    await expect(itemResolvers.Query.item(undefined, { id: '' })).rejects.toThrow(
      'id must not be empty'
    );
  });

  it('should return null when item does not exist', async () => {
    // Arrange
    mockedService.getById.mockResolvedValue(null);
    // Act
    const result = await itemResolvers.Query.item(undefined, { id: 'nope' });
    // Assert
    expect(result).toBeNull();
  });
});

describe('Query.stats', () => {
  it('should return correct counts', async () => {
    // Arrange
    mockedService.getAll.mockResolvedValue([
      { ...mockItem, status: 'active' },
      { ...mockItem, id: '2', status: 'active' },
      { ...mockItem, id: '3', status: 'pending' },
      { ...mockItem, id: '4', status: 'inactive' },
    ]);
    // Act
    const result = await itemResolvers.Query.stats();
    // Assert
    expect(result.total).toBe(4);
    expect(result.active).toBe(2);
    expect(result.pending).toBe(1);
    expect(result.inactive).toBe(1);
  });
});

describe('Mutation.createItem', () => {
  it('should create and return a new item', async () => {
    // Arrange
    const input: CreateItemInput = {
      name: 'New',
      description: 'Desc',
      status: 'active',
      category: 'Cat',
    };
    mockedService.create.mockResolvedValue({ ...mockItem, ...input });
    // Act
    const result = await itemResolvers.Mutation.createItem(undefined, { input });
    // Assert
    expect(result.name).toBe('New');
    expect(mockedService.create).toHaveBeenCalledWith(input);
  });

  it('should throw when name is empty', async () => {
    const input = { name: '', description: 'D', status: 'active' as const, category: 'C' };
    await expect(itemResolvers.Mutation.createItem(undefined, { input })).rejects.toThrow(
      'name must not be empty'
    );
  });

  it('should throw when description is empty', async () => {
    const input = { name: 'N', description: '', status: 'active' as const, category: 'C' };
    await expect(itemResolvers.Mutation.createItem(undefined, { input })).rejects.toThrow(
      'description must not be empty'
    );
  });
});

describe('Mutation.updateItem', () => {
  it('should update and return the item', async () => {
    // Arrange
    mockedService.update.mockResolvedValue({ ...mockItem, name: 'Updated' });
    // Act
    const result = await itemResolvers.Mutation.updateItem(undefined, {
      id: '1',
      input: { name: 'Updated' },
    });
    // Assert
    expect(result?.name).toBe('Updated');
  });

  it('should throw NOT_FOUND when item does not exist', async () => {
    // Arrange
    mockedService.update.mockResolvedValue(null);
    // Act & Assert
    await expect(
      itemResolvers.Mutation.updateItem(undefined, { id: '999', input: {} })
    ).rejects.toThrow('not found');
  });
});

describe('Mutation.deleteItem', () => {
  it('should return true when item is deleted', async () => {
    // Arrange
    mockedService.delete.mockResolvedValue(true);
    // Act
    const result = await itemResolvers.Mutation.deleteItem(undefined, { id: '1' });
    // Assert
    expect(result).toBe(true);
  });

  it('should return false when item does not exist', async () => {
    // Arrange
    mockedService.delete.mockResolvedValue(false);
    // Act
    const result = await itemResolvers.Mutation.deleteItem(undefined, { id: 'nope' });
    // Assert
    expect(result).toBe(false);
  });

  it('should throw when id is empty', async () => {
    await expect(
      itemResolvers.Mutation.deleteItem(undefined, { id: '' })
    ).rejects.toThrow('id must not be empty');
  });
});

// Made with Bob
