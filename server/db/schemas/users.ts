import { pgTable, uuid, text, pgEnum, timestamp } from 'drizzle-orm/pg-core';
export const userRoleEnum = pgEnum('user_role', ['ROOT', 'ADMIN', 'USER']);

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),

    name: text('name'),
    nickname: text('nickname'),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: userRoleEnum('role').default('USER').notNull(),
    lastLogin: timestamp('last_login'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at')
});