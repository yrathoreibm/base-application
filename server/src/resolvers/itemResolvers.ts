import { GraphQLError } from 'graphql';
import { itemService } from '../services/itemService';
import { assertNonEmpty, assertValidStatus, assertMaxLength } from '../utils/validate';
import type { CreateItemInput, UpdateItemInput } from '../models/item';

interface CreateItemArgs {
  input: CreateItemInput;
}

interface UpdateItemArgs {
  id: string;
  input: UpdateItemInput;
}

interface DeleteItemArgs {
  id: string;
}

interface ItemByIdArgs {
  id: string;
}

export const itemResolvers = {
  Query: {
    async items() {
      return itemService.getAll();
    },

    async item(_: unknown, { id }: ItemByIdArgs) {
      if (!id || id.trim().length === 0) {
        throw new GraphQLError('id must not be empty.', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      return itemService.getById(id);
    },

    async stats() {
      const all = await itemService.getAll();
      return {
        total: all.length,
        active: all.filter((i) => i.status === 'active').length,
        pending: all.filter((i) => i.status === 'pending').length,
        inactive: all.filter((i) => i.status === 'inactive').length,
      };
    },
  },

  Mutation: {
    async createItem(_: unknown, { input }: CreateItemArgs) {
      assertNonEmpty(input.name, 'name');
      assertMaxLength(input.name, 'name', 120);
      assertNonEmpty(input.description, 'description');
      assertMaxLength(input.description, 'description', 500);
      assertNonEmpty(input.category, 'category');
      assertValidStatus(input.status);
      return itemService.create(input);
    },

    async updateItem(_: unknown, { id, input }: UpdateItemArgs) {
      assertNonEmpty(id, 'id');
      if (input.name !== undefined) assertNonEmpty(input.name, 'name');
      if (input.status !== undefined) assertValidStatus(input.status);
      const updated = await itemService.update(id, input);
      if (!updated) {
        throw new GraphQLError(`Item with id "${id}" not found.`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return updated;
    },

    async deleteItem(_: unknown, { id }: DeleteItemArgs) {
      assertNonEmpty(id, 'id');
      return itemService.delete(id);
    },
  },
};

// Made with Bob
