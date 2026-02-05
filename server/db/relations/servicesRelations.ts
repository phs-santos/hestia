import { relations } from 'drizzle-orm';
import { services } from '../schemas/services';
import { servers } from '../schemas/servers';
import { serviceTypes } from '../schemas/serviceTypes';
import { serviceConfigs } from '../schemas/serviceConfigs';

export const servicesRelations = relations(services, ({ one, many }) => ({
    server: one(servers, {
        fields: [services.serverId],
        references: [servers.id]
    }),
    serviceType: one(serviceTypes, {
        fields: [services.serviceTypeId],
        references: [serviceTypes.id]
    }),
    serviceConfigs: many(serviceConfigs)
}));
