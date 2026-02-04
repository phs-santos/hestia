import { pgTable, uuid, text, pgEnum, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
export const statusEnum = pgEnum('status', ['active', 'inactive']);

export const logs = pgTable('logs', {
    id: uuid('id').primaryKey().defaultRandom(),

    userId: uuid('user_id').references(() => users.id),

    action: text('action').notNull(),
    details: text('details'),
    ipAddress: text('ip_address'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at')
});