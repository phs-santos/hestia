import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const servers = pgTable('servers', {
    id: uuid('id').primaryKey().defaultRandom(),

    name: text('name'),
    description: text('description'),
    host: text('host').notNull(),
    provider: text('provider'), // aws, gcp, on-prem, etc
    environment: text('environment').notNull().default('prod'), // dev, staging, prod

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
});