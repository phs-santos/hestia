import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { services } from './services';

export const serviceConfigs = pgTable('service_configs', {
    id: uuid('id').primaryKey().defaultRandom(),

    serviceId: uuid('service_id').notNull().references(() => services.id),

    key: text('key').notNull(),
    value: text('value').notNull(),
    isSecret: boolean('is_secret').default(false),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at')
});