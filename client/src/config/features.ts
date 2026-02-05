export interface FeatureConfig {
    id: string;
    name: string;
    enabled: boolean;
    path: string;
    description?: string;
    subfeatures?: FeatureConfig[];
}

/**
 * Registry of active features in the Hestia application.
 * This can be used to dynamically generate routes, sidebar items,
 * and conditionally render features.
 */
export const FEATURES_REGISTRY: FeatureConfig[] = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        enabled: true,
        path: '/dashboard',
        description: 'Painel principal de indicadores',
    },
    {
        id: 'monitoring',
        name: 'Monitoramento',
        enabled: true,
        path: '/servers',
        description: 'Gestão de servidores e serviços',
        subfeatures: [
            {
                id: 'monitoring-servers',
                name: 'Servidores',
                enabled: true,
                path: '/servers',
            },
            {
                id: 'monitoring-services',
                name: 'Serviços',
                enabled: true,
                path: '/services',
            }
        ]
    },
    {
        id: 'products',
        name: 'Produtos',
        enabled: false,
        path: '/products',
        description: 'Gestão de catálogo de produtos',
        subfeatures: [
            {
                id: 'products-list',
                name: 'Ver Produtos',
                enabled: true,
                path: '/products',
            },
            {
                id: 'products-inventory',
                name: 'Estoque',
                enabled: false,
                path: '/products/inventory',
            }
        ]
    }
];

/**
 * Deeply search for a feature by ID recursively.
 */
const findFeature = (features: FeatureConfig[], id: string): FeatureConfig | undefined => {
    for (const feature of features) {
        if (feature.id === id) return feature;
        if (feature.subfeatures) {
            const found = findFeature(feature.subfeatures, id);
            if (found) return found;
        }
    }
    return undefined;
};

/**
 * Returns only enabled top-level features.
 */
export const getActiveFeatures = () => FEATURES_REGISTRY.filter(f => f.enabled);

/**
 * Checks if a specific feature (or subfeature) is enabled.
 */
export const isFeatureEnabled = (id: string) => {
    const feature = findFeature(FEATURES_REGISTRY, id);
    return feature?.enabled || false;
};
