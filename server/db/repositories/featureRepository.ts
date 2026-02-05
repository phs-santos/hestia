import { db } from '../index';
import { features, subfeatures } from '../schema';
import { eq, isNull, and } from 'drizzle-orm';

export const featureRepository = {
    async findAll() {
        return await db.query.features.findMany({
            with: {
                subfeatures: {
                    where: isNull(subfeatures.deletedAt)
                }
            },
            where: isNull(features.deletedAt)
        });
    },

    async findByCode(code: string) {
        return await db.query.features.findFirst({
            where: eq(features.code, code),
            with: {
                subfeatures: true
            }
        });
    },

    async create(data: any) {
        const [result] = await db.insert(features).values(data).returning();
        return result;
    },

    async createSubfeature(data: any) {
        const [result] = await db.insert(subfeatures).values(data).returning();
        return result;
    },

    async update(code: string, data: any) {
        await db.update(features)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(features.code, code));
    },

    async updateSubfeature(code: string, data: any) {
        await db.update(subfeatures)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(subfeatures.code, code));
    },

    async delete(code: string) {
        await db.update(features)
            .set({ deletedAt: new Date(), updatedAt: new Date() })
            .where(eq(features.code, code));
    },

    async deleteSubfeature(code: string) {
        await db.update(subfeatures)
            .set({ deletedAt: new Date(), updatedAt: new Date() })
            .where(eq(subfeatures.code, code));
    }
};
