import { pgTable, uuid, text, pgEnum, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

// Enums
export const statusEnum = pgEnum('status', ['active', 'inactive']);

// AuditLogs
export const logs = pgTable('logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    action: text('action').notNull(),
    details: text('details'),
    ipAddress: text('ip_address'),
    userId: uuid('user_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});