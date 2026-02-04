import { relations } from 'drizzle-orm';
import { users } from '../schemas/users';
import { logs } from '../schemas/logs';

export const logsRelations = relations(logs, ({ one }) => ({
    user: one(users, {
        fields: [logs.userId],
        references: [users.id]
    })
}));
