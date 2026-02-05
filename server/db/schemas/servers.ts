import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const servers = pgTable('servers', {
    id: uuid('id').primaryKey().defaultRandom(),

    name: text('name'),
    description: text('description'),
    ip: text('ip').notNull().default('127.0.0.1'),
    host: text('host'), // keeping for backward compatibility if needed, or alias
    provider: text('provider'), // aws, gcp, on-prem, etc
    environment: text('environment').notNull().default('prod'), // dev, staging, prod

    status: text('status').default('running'),
    region: text('region'),
    cpu: integer('cpu').default(0),
    memory: integer('memory').default(0),
    storage: integer('storage').default(0),
    uptime: text('uptime').default('0d 0h 0m'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
});