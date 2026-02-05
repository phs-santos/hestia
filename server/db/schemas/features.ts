import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const features = pgTable('features', {
    id: uuid('id').primaryKey().defaultRandom(),
    code: text('code').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    path: text('path').notNull(),
    enabled: boolean('enabled').default(true).notNull(),
    allowedRoles: text('allowed_roles').array().notNull().default(['ROOT', 'ADMIN']),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at')
});

export const subfeatures = pgTable('subfeatures', {
    id: uuid('id').primaryKey().defaultRandom(),
    featureId: uuid('feature_id').notNull().references(() => features.id, { onDelete: 'cascade' }),

    code: text('code').notNull().unique(),
    name: text('name').notNull(),
    path: text('path').notNull(),
    enabled: boolean('enabled').default(true).notNull(),
    allowedRoles: text('allowed_roles').array().notNull().default(['ROOT', 'ADMIN']),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at')
});
