import { itemService } from '../../services/itemService';
import type { CreateItemInput } from '../../models/item';

// Mock the DB pool so tests run without a real MySQL connection
jest.mock('../../db', () => ({
  query: jest.fn(),
}));

import pool from '../../db';
const mockedPool = pool as jest.Mocked<typeof pool>;

// Helper: make pool.query return a specific rows result
function mockQuery(rows: unknown[]): void {
  (mockedPool.query as jest.Mock).mockResolvedValueOnce([rows]);
}

// Helper: make pool.query return a ResultSetHeader-style result
function mockExec(affectedRows: number): void {
  (mockedPool.query as jest.Mock).mockResolvedValueOnce([{ affectedRows }]);
}

const seedRow = {
  id: '1',
  name: 'Sample Item Alpha',
  description: 'Desc',
  status: 'active' as const,
  category: 'General',
  created_at: new Date('2024-01-01T00:00:00.000Z'),
  updated_at: new Date('2024-01-01T00:00:00.000Z'),
};

describe('itemService.getAll', () => {
  it('should return all items mapped to camelCase', async () => {
    mockQuery([seedRow]);
    const items = await itemService.getAll();
    expect(items.length).toBe(1);
    expect(items[0]?.createdAt).toBe('2024-01-01T00:00:00.000Z');
  });
});

describe('itemService.getById', () => {
  it('should return an item when it exists', async () => {
    mockQuery([seedRow]);
    const item = await itemService.getById('1');
    expect(item).not.toBeNull();
    expect(item?.name).toBe('Sample Item Alpha');
  });

  it('should return null when item does not exist', async () => {
    mockQuery([]);
    const item = await itemService.getById('nonexistent');
    expect(item).toBeNull();
  });
});

describe('itemService.create', () => {
  it('should create a new item with a generated id', async () => {
    // INSERT succeeds, then getById returns the new row
    mockExec(1);
    mockQuery([seedRow]);
    const input: CreateItemInput = {
      name: 'New Item',
      description: 'A description',
      status: 'active',
      category: 'Test',
    };
    const item = await itemService.create(input);
    expect(item.id).toBeTruthy();
    expect(item.createdAt).toBeTruthy();
  });
});

describe('itemService.update', () => {
  it('should update fields of an existing item', async () => {
    const updatedRow = { ...seedRow, name: 'Updated Name', status: 'inactive' as const };
    mockQuery([seedRow]);    // getById (existing check)
    mockExec(1);             // UPDATE
    mockQuery([updatedRow]); // getById (return updated)
    const updated = await itemService.update('1', { name: 'Updated Name', status: 'inactive' });
    expect(updated).not.toBeNull();
    expect(updated?.name).toBe('Updated Name');
    expect(updated?.status).toBe('inactive');
  });

  it('should return null when item does not exist', async () => {
    mockQuery([]); // getById returns empty
    const result = await itemService.update('nope', { name: 'x' });
    expect(result).toBeNull();
  });

  it('should return existing item unchanged when input is empty', async () => {
    mockQuery([seedRow]); // getById (existing check) — fields.length === 0 branch
    const result = await itemService.update('1', {});
    expect(result?.id).toBe('1');
  });

  it('should update description and category fields', async () => {
    const updatedRow = { ...seedRow, description: 'New desc', category: 'NewCat' };
    mockQuery([seedRow]);    // getById (existing check)
    mockExec(1);             // UPDATE
    mockQuery([updatedRow]); // getById (return updated)
    const result = await itemService.update('1', { description: 'New desc', category: 'NewCat' });
    expect(result?.description).toBe('New desc');
    expect(result?.category).toBe('NewCat');
  });
});

describe('itemService.delete', () => {
  it('should return true when item is deleted', async () => {
    mockExec(1);
    const result = await itemService.delete('1');
    expect(result).toBe(true);
  });

  it('should return false when item does not exist', async () => {
    mockExec(0);
    const result = await itemService.delete('ghost-id');
    expect(result).toBe(false);
  });
});

// Made with Bob
