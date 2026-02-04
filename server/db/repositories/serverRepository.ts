import { db } from '../index';
import { servers } from '../schema';
import { eq, isNull, and } from 'drizzle-orm';

export type NewServer = typeof servers.$inferInsert;
export type Server = typeof servers.$inferSelect;

export const serverRepository = {
    async findById(id: string): Promise<Server | undefined> {
        return await db.query.servers.findFirst({
            where: and(eq(servers.id, id), isNull(servers.deletedAt))
        });
    },

    async create(data: NewServer): Promise<Server> {
        const [newServer] = await db.insert(servers).values(data).returning();
        return newServer;
    },

    async update(id: string, data: Partial<NewServer>): Promise<void> {
        await db.update(servers)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(servers.id, id));
    },

    async getAll(columns?: any): Promise<any[]> {
        return await db.query.servers.findMany({
            where: isNull(servers.deletedAt),
            columns
        });
    },

    async delete(id: string): Promise<void> {
        await db.update(servers)
            .set({ deletedAt: new Date(), updatedAt: new Date() })
            .where(eq(servers.id, id));
    }
};
