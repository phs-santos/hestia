import { db } from '../index';
import { services } from '../schema';
import { eq, isNull, and } from 'drizzle-orm';

export type NewService = typeof services.$inferInsert;
export type Service = typeof services.$inferSelect;

export const serviceRepository = {
    async findById(id: string): Promise<Service | undefined> {
        return await db.query.services.findFirst({
            where: and(eq(services.id, id), isNull(services.deletedAt))
        });
    },

    async create(data: NewService): Promise<Service> {
        const [newService] = await db.insert(services).values(data).returning();
        return newService;
    },

    async update(id: string, data: Partial<NewService>): Promise<void> {
        await db.update(services)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(services.id, id));
    },

    async getAll(columns?: any): Promise<any[]> {
        return await db.query.services.findMany({
            where: isNull(services.deletedAt),
            columns
        });
    },

    async delete(id: string): Promise<void> {
        await db.update(services)
            .set({ deletedAt: new Date(), updatedAt: new Date() })
            .where(eq(services.id, id));
    }
};
