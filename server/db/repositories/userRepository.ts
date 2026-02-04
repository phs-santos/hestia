import { db } from '../index';
import { users } from '../schema';
import { count, eq, isNull, and } from 'drizzle-orm';

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const userRepository = {
    async findById(id: string): Promise<User | undefined> {
        return await db.query.users.findFirst({
            where: and(eq(users.id, id), isNull(users.deletedAt))
        });
    },

    async findByEmail(email: string): Promise<User | undefined> {
        return await db.query.users.findFirst({
            where: and(eq(users.email, email), isNull(users.deletedAt))
        });
    },

    async findByNickname(nickname: string): Promise<User | undefined> {
        return await db.query.users.findFirst({
            where: and(eq(users.nickname, nickname), isNull(users.deletedAt))
        });
    },

    async create(data: NewUser): Promise<User> {
        const [newUser] = await db.insert(users).values(data).returning();
        return newUser;
    },

    async update(id: string, data: Partial<NewUser>): Promise<void> {
        await db.update(users)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(users.id, id));
    },

    async getAll(columns?: any): Promise<any[]> {
        return await db.query.users.findMany({
            where: isNull(users.deletedAt),
            columns
        });
    },

    async delete(id: string): Promise<void> {
        await db.update(users)
            .set({ deletedAt: new Date(), updatedAt: new Date() })
            .where(eq(users.id, id));
    },

    async count(): Promise<number> {
        const [result] = await db.select({ count: count(users.id) })
            .from(users)
            .where(isNull(users.deletedAt));
        return result.count;
    }
};
