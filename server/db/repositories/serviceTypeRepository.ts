import { db } from '../index';
import { serviceTypes } from '../schema';
import { eq, isNull, and } from 'drizzle-orm';

export type NewServiceType = typeof serviceTypes.$inferInsert;
export type ServiceType = typeof serviceTypes.$inferSelect;

export const serviceTypeRepository = {
    async findById(id: string): Promise<ServiceType | undefined> {
        return await db.query.serviceTypes.findFirst({
            where: and(eq(serviceTypes.id, id), isNull(serviceTypes.deletedAt))
        });
    },

    async create(data: NewServiceType): Promise<ServiceType> {
        const [newServiceType] = await db.insert(serviceTypes).values(data).returning();
        return newServiceType;
    },

    async update(id: string, data: Partial<NewServiceType>): Promise<void> {
        await db.update(serviceTypes)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(serviceTypes.id, id));
    },

    async getAll(columns?: any): Promise<any[]> {
        return await db.query.serviceTypes.findMany({
            where: isNull(serviceTypes.deletedAt),
            columns
        });
    },

    async delete(id: string): Promise<void> {
        await db.update(serviceTypes)
            .set({ deletedAt: new Date(), updatedAt: new Date() })
            .where(eq(serviceTypes.id, id));
    }
};
