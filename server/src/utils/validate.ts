import { GraphQLError } from 'graphql';

const VALID_STATUSES = new Set(['pending', 'active', 'inactive']);

export function assertNonEmpty(value: string, fieldName: string): void {
  if (!value || value.trim().length === 0) {
    throw new GraphQLError(`${fieldName} must not be empty.`, {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
}

export function assertValidStatus(status: string): void {
  if (!VALID_STATUSES.has(status)) {
    throw new GraphQLError(
      `Invalid status "${status}". Must be one of: pending, active, inactive.`,
      { extensions: { code: 'BAD_USER_INPUT' } }
    );
  }
}

export function assertMaxLength(value: string, fieldName: string, max: number): void {
  if (value.trim().length > max) {
    throw new GraphQLError(`${fieldName} must not exceed ${max} characters.`, {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
}

// Made with Bob
