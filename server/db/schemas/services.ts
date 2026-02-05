import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { servers } from './servers';
import { serviceTypes } from './serviceTypes';

export const services = pgTable('services', {
    id: uuid('id').primaryKey().defaultRandom(),

    serverId: uuid('server_id').notNull().references(() => servers.id),
    serviceTypeId: uuid('service_type_id').references(() => serviceTypes.id), // Made optional

    name: text('name').notNull(),
    type: text('type').notNull().default('pending'), // database, api, web, cache, queue, storage
    description: text('description'),
    version: text('version'),
    port: integer('port'),
    status: text('status').default('stopped'),

    lastDeployment: timestamp('last_deployment'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
});