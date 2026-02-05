export type UserRole = 'ROOT' | 'ADMIN' | 'USER';

export interface FeatureConfig {
    id: string;
    name: string;
    enabled: boolean;
    path: string;
    description?: string;
    allowedRoles?: UserRole[];
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
        allowedRoles: ['ROOT', 'ADMIN', 'USER'],
    },
    {
        id: 'monitoring',
        name: 'Monitoramento',
        enabled: true,
        path: '/servers',
        description: 'Gestão de servidores e serviços',
        allowedRoles: ['ROOT', 'ADMIN'],
        subfeatures: [
            {
                id: 'monitoring-servers',
                name: 'Servidores',
                enabled: true,
                path: '/servers',
                allowedRoles: ['ROOT', 'ADMIN'],
            },
            {
                id: 'monitoring-services',
                name: 'Serviços',
                enabled: true,
                path: '/services',
                allowedRoles: ['ROOT', 'ADMIN'],
            }
        ]
    },
    {
        id: 'products',
        name: 'Produtos',
        enabled: false,
        path: '/products',
        description: 'Gestão de catálogo de produtos',
        allowedRoles: ['ROOT', 'ADMIN', 'USER'],
        subfeatures: [
            {
                id: 'products-list',
                name: 'Ver Produtos',
                enabled: true,
                path: '/products',
                allowedRoles: ['ROOT', 'ADMIN', 'USER'],
            },
            {
                id: 'products-inventory',
                name: 'Estoque',
                enabled: false,
                path: '/products/inventory',
                allowedRoles: ['ROOT', 'ADMIN'],
            }
        ]
    },
    {
        id: 'root-management',
        name: 'Administração',
        enabled: true,
        path: '/admin',
        description: 'Gestão de usuários e permissões do sistema',
        allowedRoles: ['ROOT'],
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
 * Returns only enabled top-level features accessible by the user's role.
 */
export const getActiveFeatures = (userRole?: UserRole) => {
    return FEATURES_REGISTRY.filter(f => {
        if (!f.enabled) return false;
        if (!userRole) return false;
        if (f.allowedRoles && !f.allowedRoles.includes(userRole)) return false;
        return true;
    });
};

/**
 * Checks if a specific feature (or subfeature) is enabled and accessible.
 */
export const isFeatureEnabled = (id: string, userRole?: UserRole) => {
    const feature = findFeature(FEATURES_REGISTRY, id);
    if (!feature?.enabled) return false;
    if (!userRole) return false;
    if (feature.allowedRoles && !feature.allowedRoles.includes(userRole)) return false;
    return true;
};
