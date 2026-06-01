// Template: PostgreSQL Database Helper
// Category: Common
// Usage: const db = new DatabaseHelper(config); await db.connect();
// ⚠️ pg uses dynamic import to prevent TypeScript from compiling native bindings on Windows CI.

type PgClient = import('pg').Client;
type QueryResult = import('pg').QueryResult;

/**
 * DatabaseHelper - Class for managing PostgreSQL Database
 * Supports CRUD operations, transactions, and connection management
 * 
 * ✅ FEATURES:
 * - Basic CRUD (select, insert, update, delete)
 * - Transaction support (begin, commit, rollback)
 * - Bulk operations (bulkInsert, upsert)
 * - Soft delete (softDelete, restore)
 * - Query builder (fluent API)
 * 
 * @example
 * // Basic usage
 * import dbConfig from './dbConfig.json';
 * const db = new DatabaseHelper(dbConfig);
 * await db.connect();
 * 
 * // CRUD
 * const users = await db.select('users', { status: 'active' });
 * const user = await db.selectOne('users', { id: 1 });
 */
export class DatabaseHelper {
  private client!: PgClient;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  /**
   * 🔥 Connect to Database
   */
  async connect(): Promise<void> {
    try {
      const { Client } = await import('pg');
      this.client = new Client({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
        ssl: this.config.ssl,
        connectionTimeoutMillis: this.config.timeout || 5000
      });
      await this.client.connect();
    } catch (error) {
      throw new Error(`Failed to connect to database ${this.config.database}: ${error}`);
    }
  }

  /**
   * 🔥 Run SQL Query
   */
  async query(sql: string, params?: any[]): Promise<QueryResult> {
    try {
      return await this.client.query(sql, params);
    } catch (error) {
      throw new Error(`Query failed: ${error}\nSQL: ${sql}\nParams: ${JSON.stringify(params)}`);
    }
  }

  /**
   * Close Database connection
   */
  async disconnect(): Promise<void> {
    try {
      await this.client.end();
    } catch (error) {
      throw new Error(`Failed to disconnect: ${error}`);
    }
  }

  /**
   * SELECT - Fetch multiple rows
   */
  async select<T = any>(table: string, where?: { [key: string]: any }): Promise<T[]> {
    const conditions = where ? this.buildWhere(where) : { sql: '', params: [] };
    const sql = `SELECT * FROM ${table}${conditions.sql}`;
    const result = await this.query(sql, conditions.params);
    return result.rows;
  }

  /**
   * SELECT ONE - Fetch single row
   */
  async selectOne<T = any>(table: string, where: { [key: string]: any }): Promise<T | null> {
    const rows = await this.select<T>(table, where);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * INSERT - Add data
   */
  async insert(table: string, data: { [key: string]: any }): Promise<QueryResult> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    return await this.query(sql, values);
  }

  /**
   * UPDATE - Modify data
   */
  async update(table: string, data: { [key: string]: any }, where: { [key: string]: any }): Promise<QueryResult> {
    const setKeys = Object.keys(data);
    const setValues = Object.values(data);
    const setClause = setKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');

    const conditions = this.buildWhere(where, setValues.length);
    const sql = `UPDATE ${table} SET ${setClause}${conditions.sql} RETURNING *`;

    return await this.query(sql, [...setValues, ...conditions.params]);
  }

  /**
   * DELETE - Remove data
   */
  async delete(table: string, where: { [key: string]: any }): Promise<QueryResult> {
    const conditions = this.buildWhere(where);
    const sql = `DELETE FROM ${table}${conditions.sql} RETURNING *`;
    return await this.query(sql, conditions.params);
  }

  /**
   * COUNT - Count number of rows
   */
  async count(table: string, where?: { [key: string]: any }): Promise<number> {
    const conditions = where ? this.buildWhere(where) : { sql: '', params: [] };
    const sql = `SELECT COUNT(*) as count FROM ${table}${conditions.sql}`;
    const result = await this.query(sql, conditions.params);
    return parseInt(result.rows[0].count);
  }

  /**
   * EXISTS - Check if data exists
   */
  async exists(table: string, where: { [key: string]: any }): Promise<boolean> {
    const count = await this.count(table, where);
    return count > 0;
  }

  /**
   * TRUNCATE - Delete all data in table
   */
  async truncate(table: string): Promise<void> {
    await this.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
  }

  // ===== 🔥 Transaction Support =====

  /**
   * 🔥 Start Transaction
   */
  async beginTransaction(): Promise<void> {
    await this.query('BEGIN');
  }

  /**
   * Commit Transaction
   */
  async commit(): Promise<void> {
    await this.query('COMMIT');
  }

  /**
   * Rollback Transaction
   */
  async rollback(): Promise<void> {
    await this.query('ROLLBACK');
  }

  /**
   * Run function within Transaction (Auto commit/rollback)
   * 
   * @example
   * await db.transaction(async () => {
   *   await db.insert('users', { name: 'John' });
   *   await db.insert('orders', { userId: 1 });
   * });
   */
  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    await this.beginTransaction();
    try {
      const result = await fn();
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  // ===== 🔥 Bulk Operations =====

  /**
   * 🔥 BULK INSERT - Insert multiple records at once
   * 
   * @example
   * await db.bulkInsert('users', [
   *   { name: 'John', email: 'john@test.com' },
   *   { name: 'Jane', email: 'jane@test.com' }
   * ]);
   */
  async bulkInsert(table: string, data: { [key: string]: any }[]): Promise<QueryResult> {
    if (data.length === 0) {
      throw new Error('Bulk insert requires at least one record');
    }

    const keys = Object.keys(data[0]);
    const values: any[] = [];
    const placeholders: string[] = [];

    data.forEach((record, recordIndex) => {
      const recordPlaceholders = keys.map((_, keyIndex) => {
        const paramIndex = recordIndex * keys.length + keyIndex + 1;
        values.push(record[keys[keyIndex]]);
        return `$${paramIndex}`;
      });
      placeholders.push(`(${recordPlaceholders.join(', ')})`);
    });

    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES ${placeholders.join(', ')} RETURNING *`;
    return await this.query(sql, values);
  }

  /**
   * 🔥 UPSERT - Insert if not exists, Update if exists
   * 
   * @example
   * await db.upsert('users', 
   *   { email: 'john@test.com' },
   *   { name: 'John Updated', status: 'active' }
   * );
   */
  async upsert(
    table: string,
    uniqueKey: { [key: string]: any },
    data: { [key: string]: any }
  ): Promise<QueryResult> {
    const allData = { ...uniqueKey, ...data };
    const keys = Object.keys(allData);
    const values = Object.values(allData);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const uniqueKeys = Object.keys(uniqueKey);
    const updateKeys = Object.keys(data);
    const updateClause = updateKeys.map(key => `${key} = EXCLUDED.${key}`).join(', ');

    const sql = `
      INSERT INTO ${table} (${keys.join(', ')}) 
      VALUES (${placeholders})
      ON CONFLICT (${uniqueKeys.join(', ')}) 
      DO UPDATE SET ${updateClause}
      RETURNING *
    `;

    return await this.query(sql, values);
  }

  // ===== 🔥 Soft Delete =====

  /**
   * 🔥 SOFT DELETE - Delete without actual removal (set deletedAt)
   */
  async softDelete(table: string, where: { [key: string]: any }): Promise<QueryResult> {
    const conditions = this.buildWhere(where);
    const sql = `UPDATE ${table} SET deleted_at = NOW()${conditions.sql} RETURNING *`;
    return await this.query(sql, conditions.params);
  }

  /**
   * RESTORE - Restore soft deleted data
   */
  async restore(table: string, where: { [key: string]: any }): Promise<QueryResult> {
    const conditions = this.buildWhere(where);
    const sql = `UPDATE ${table} SET deleted_at = NULL${conditions.sql} RETURNING *`;
    return await this.query(sql, conditions.params);
  }

  // ===== 🔥 Query Builder =====

  /**
   * 🔥 QUERY BUILDER - Create complex queries with fluent API
   * 
   * @example
   * const users = await db.queryBuilder('users')
   *   .select(['id', 'name', 'email'])
   *   .where('status', '=', 'active')
   *   .orderBy('name', 'asc')
   *   .limit(10)
   *   .execute();
   */
  queryBuilder(table: string): QueryBuilder {
    return new QueryBuilder(this, table);
  }

  // ===== Private Helper Methods =====

  private buildWhere(where: { [key: string]: any }, offset: number = 0): { sql: string; params: any[] } {
    const keys = Object.keys(where);
    const params = Object.values(where);

    if (keys.length === 0) {
      return { sql: '', params: [] };
    }

    const conditions = keys.map((key, i) => `${key} = $${i + 1 + offset}`).join(' AND ');
    return { sql: ` WHERE ${conditions}`, params };
  }
}

/**
 * QueryBuilder - Fluent API for creating SQL queries
 */
class QueryBuilder {
  private db: DatabaseHelper;
  private table: string;
  private selectFields: string[] = ['*'];
  private whereConditions: { field: string; operator: string; value: any }[] = [];
  private orderByClause: string = '';
  private limitValue?: number;
  private offsetValue?: number;

  constructor(db: DatabaseHelper, table: string) {
    this.db = db;
    this.table = table;
  }

  select(fields: string[]): this {
    this.selectFields = fields;
    return this;
  }

  where(field: string, operator: string, value: any): this {
    this.whereConditions.push({ field, operator, value });
    return this;
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    this.orderByClause = `ORDER BY ${field} ${direction.toUpperCase()}`;
    return this;
  }

  limit(value: number): this {
    this.limitValue = value;
    return this;
  }

  offset(value: number): this {
    this.offsetValue = value;
    return this;
  }

  async execute<T = any>(): Promise<T[]> {
    const params: any[] = [];
    let sql = `SELECT ${this.selectFields.join(', ')} FROM ${this.table}`;

    if (this.whereConditions.length > 0) {
      const conditions = this.whereConditions.map((cond, i) => {
        params.push(cond.value);
        return `${cond.field} ${cond.operator} $${i + 1}`;
      });
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    if (this.orderByClause) {
      sql += ` ${this.orderByClause}`;
    }

    if (this.limitValue !== undefined) {
      params.push(this.limitValue);
      sql += ` LIMIT $${params.length}`;
    }

    if (this.offsetValue !== undefined) {
      params.push(this.offsetValue);
      sql += ` OFFSET $${params.length}`;
    }

    const result = await this.db.query(sql, params);
    return result.rows;
  }
}

/**
 * Database Configuration Interface
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
  timeout?: number;
  maxConnections?: number;
  idleTimeout?: number;
  connectionTimeout?: number;
}

// ===== Usage Examples =====

/*
import { DatabaseHelper } from './database.template';
import dbConfig from './dbConfig.json';

// Variant 1: Basic Connection
const db = new DatabaseHelper(dbConfig);
await db.connect();

const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
console.log(result.rows);

await db.disconnect();

// Variant 2: SELECT Operations
const users = await db.select('users', { status: 'active' });
const user = await db.selectOne('users', { id: 123 });
const count = await db.count('users', { role: 'admin' });
const hasUser = await db.exists('users', { email: 'test@example.com' });

// Variant 3: INSERT
const result = await db.insert('users', {
  name: 'John Doe',
  email: 'john@example.com',
  status: 'active'
});
console.log('Inserted:', result.rows[0]);

// Variant 4: UPDATE
const result = await db.update(
  'users',
  { status: 'inactive' },
  { id: 123 }
);
console.log('Updated:', result.rows[0]);

// Variant 5: DELETE
const result = await db.delete('users', { id: 123 });
console.log('Deleted:', result.rows[0]);

// Variant 6: Cleanup (Test Data)
await db.truncate('test_users');

// Variant 7: Transaction (Manual)
await db.beginTransaction();
try {
  await db.insert('users', { name: 'John', email: 'john@test.com' });
  await db.insert('orders', { userId: 1, total: 1000 });
  await db.commit();
} catch (error) {
  await db.rollback();
  throw error;
}

// Variant 8: Transaction (Auto)
await db.transaction(async () => {
  await db.insert('users', { name: 'John' });
  await db.insert('orders', { userId: 1 });
});

// Variant 9: Bulk Insert
await db.bulkInsert('users', [
  { name: 'John', email: 'john@test.com' },
  { name: 'Jane', email: 'jane@test.com' },
  { name: 'Bob', email: 'bob@test.com' }
]);

// Variant 10: Upsert
await db.upsert('users',
  { email: 'john@test.com' },
  { name: 'John Updated', status: 'active' }
);

// Variant 11: Soft Delete
await db.softDelete('users', { id: 1 });
await db.restore('users', { id: 1 });

// Variant 12: Query Builder
const users = await db.queryBuilder('users')
  .select(['id', 'name', 'email'])
  .where('status', '=', 'active')
  .where('createdAt', '>', '2024-01-01')
  .orderBy('name', 'asc')
  .limit(10)
  .execute();

// Variant 13: Config from JSON
// dbConfig.json
{
  "host": "localhost",
  "port": 5432,
  "user": "testuser",
  "password": "testpass",
  "database": "testdb",
  "ssl": false,
  "timeout": 5000
}
*/
