import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const serviceTypes = pgTable('service_types', {
    id: uuid('id').primaryKey().defaultRandom(),

    code: text('code').unique().notNull(), // api, database, frontend, worker, cache
    name: text('name').notNull(),
    description: text('description'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at')
});