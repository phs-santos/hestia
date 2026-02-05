import { relations } from 'drizzle-orm';
import { servers } from '../schemas/servers';
import { services } from '../schemas/services';

export const serversRelations = relations(servers, ({ many }) => ({
    services: many(services)
}));
