import { relations } from 'drizzle-orm';
import { features, subfeatures } from '../schemas/features';

export const featuresRelations = relations(features, ({ many }) => ({
    subfeatures: many(subfeatures),
}));

export const subfeaturesRelations = relations(subfeatures, ({ one }) => ({
    feature: one(features, {
        fields: [subfeatures.featureId],
        references: [features.id],
    }),
}));
