import { db } from '../index';
import { serviceConfigs } from '../schema';
import { eq, isNull, and } from 'drizzle-orm';

export type NewServiceConfig = typeof serviceConfigs.$inferInsert;
export type ServiceConfig = typeof serviceConfigs.$inferSelect;

export const serviceConfigRepository = {
    async findById(id: string): Promise<ServiceConfig | undefined> {
        return await db.query.serviceConfigs.findFirst({
            where: and(eq(serviceConfigs.id, id), isNull(serviceConfigs.deletedAt))
        });
    },

    async findByServiceId(serviceId: string): Promise<ServiceConfig[]> {
        return await db.query.serviceConfigs.findMany({
            where: and(eq(serviceConfigs.serviceId, serviceId), isNull(serviceConfigs.deletedAt))
        });
    },

    async create(data: NewServiceConfig): Promise<ServiceConfig> {
        const [newServiceConfig] = await db.insert(serviceConfigs).values(data).returning();
        return newServiceConfig;
    },

    async update(id: string, data: Partial<NewServiceConfig>): Promise<void> {
        await db.update(serviceConfigs)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(serviceConfigs.id, id));
    },

    async getAll(columns?: any): Promise<any[]> {
        return await db.query.serviceConfigs.findMany({
            where: isNull(serviceConfigs.deletedAt),
            columns
        });
    },

    async delete(id: string): Promise<void> {
        await db.update(serviceConfigs)
            .set({ deletedAt: new Date(), updatedAt: new Date() })
            .where(eq(serviceConfigs.id, id));
    }
};
