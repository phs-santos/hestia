import { relations } from 'drizzle-orm';
import { serviceConfigs } from '../schemas/serviceConfigs';
import { services } from '../schemas/services';

export const serviceConfigsRelations = relations(serviceConfigs, ({ one }) => ({
    service: one(services, {
        fields: [serviceConfigs.serviceId],
        references: [services.id]
    })
}));
