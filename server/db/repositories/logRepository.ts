import { db } from '../index';
import { logs } from '../schema';

export type NewLog = typeof logs.$inferInsert;
export type Log = typeof logs.$inferSelect;

export const logRepository = {
    async create(data: NewLog): Promise<void> {
        await db.insert(logs).values(data);
    },

    async getAll(): Promise<Log[]> {
        return await db.query.logs.findMany({
            with: {
                user: {
                    columns: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: (logs, { desc }) => [desc(logs.createdAt)]
        });
    }
};
