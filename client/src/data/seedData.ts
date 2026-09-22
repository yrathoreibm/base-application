import { Item } from '@/types';

export const seedItems: Item[] = [
  {
    id: '1',
    name: 'Sample Item Alpha',
    description: 'The first sample item in the base application.',
    status: 'active',
    category: 'General',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Sample Item Beta',
    description: 'The second sample item for demonstration purposes.',
    status: 'pending',
    category: 'General',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Sample Item Gamma',
    description: 'An inactive item to demonstrate status filtering.',
    status: 'inactive',
    category: 'Archive',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
];

// Made with Bob
