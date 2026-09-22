export const typeDefs = `#graphql
  """
  Represents an item in the base application.
  Replace with your real domain type.
  """
  type Item {
    id: ID!
    name: String!
    description: String!
    status: ItemStatus!
    category: String!
    createdAt: String!
    updatedAt: String!
  }

  """
  Represents application-level statistics.
  """
  type Stats {
    total: Int!
    active: Int!
    pending: Int!
    inactive: Int!
  }

  """
  Item lifecycle status.
  """
  enum ItemStatus {
    pending
    active
    inactive
  }

  input CreateItemInput {
    name: String!
    description: String!
    status: ItemStatus!
    category: String!
  }

  input UpdateItemInput {
    name: String
    description: String
    status: ItemStatus
    category: String
  }

  type Query {
    "Return all items."
    items: [Item!]!
    "Return a single item by ID. Returns null if not found."
    item(id: ID!): Item
    "Return aggregate statistics."
    stats: Stats!
  }

  type Mutation {
    "Create a new item."
    createItem(input: CreateItemInput!): Item!
    "Update an existing item. Returns null if not found."
    updateItem(id: ID!, input: UpdateItemInput!): Item
    "Delete an item. Returns true on success."
    deleteItem(id: ID!): Boolean!
  }
`;

// Made with Bob
