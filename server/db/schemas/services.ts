import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { servers } from './servers';
import { serviceTypes } from './serviceTypes';

export const services = pgTable('services', {
    id: uuid('id').primaryKey().defaultRandom(),

    serverId: uuid('server_id').notNull().references(() => servers.id),
    serviceTypeId: uuid('service_type_id').notNull().references(() => serviceTypes.id),

    name: text('name').notNull(),
    description: text('description'),
    version: text('version'),
    status: text('status').default('stopped'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
});