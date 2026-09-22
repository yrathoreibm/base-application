import { randomUUID } from 'crypto';
import mysql from 'mysql2/promise';
import pool from '../db';
import { Item, ItemStatus, CreateItemInput, UpdateItemInput } from '../models/item';

/**
 * Raw row shape returned by MySQL — snake_case column names.
 */
interface ItemRow {
  id: string;
  name: string;
  description: string;
  status: ItemStatus;
  category: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Maps a raw MySQL row to the Item domain model (camelCase).
 */
function toItem(row: ItemRow): Item {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    category: row.category,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export const itemService = {
  async getAll(): Promise<Item[]> {
    const [rows] = await pool.query<mysql.RowDataPacket[]>('SELECT * FROM items ORDER BY created_at ASC');
    return (rows as ItemRow[]).map(toItem);
  },

  async getById(id: string): Promise<Item | null> {
    const [rows] = await pool.query<mysql.RowDataPacket[]>('SELECT * FROM items WHERE id = ?', [id]);
    if ((rows as ItemRow[]).length === 0) return null;
    return toItem((rows as ItemRow[])[0]);
  },

  async create(input: CreateItemInput): Promise<Item> {
    const id = randomUUID();
    await pool.query(
      'INSERT INTO items (id, name, description, status, category) VALUES (?, ?, ?, ?, ?)',
      [id, input.name, input.description, input.status, input.category]
    );
    return (await itemService.getById(id)) as Item;
  },

  async update(id: string, input: UpdateItemInput): Promise<Item | null> {
    const existing = await itemService.getById(id);
    if (!existing) return null;

    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.name !== undefined)        { fields.push('name = ?');        values.push(input.name); }
    if (input.description !== undefined) { fields.push('description = ?'); values.push(input.description); }
    if (input.status !== undefined)      { fields.push('status = ?');      values.push(input.status); }
    if (input.category !== undefined)    { fields.push('category = ?');    values.push(input.category); }

    if (fields.length === 0) return existing;

    values.push(id);
    await pool.query(`UPDATE items SET ${fields.join(', ')} WHERE id = ?`, values);
    return await itemService.getById(id);
  },

  async delete(id: string): Promise<boolean> {
    const [result] = await pool.query<mysql.ResultSetHeader>('DELETE FROM items WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

// Made with Bob
