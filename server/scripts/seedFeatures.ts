import { db } from '../db/index';
import { features, subfeatures } from '../db/schema';
import { logger } from '../utils/consoleLogger';

const seedFeatures = async () => {
    try {
        logger.info('🌱 Semeando features...');

        // Clear existing to avoid unique constraint issues
        await db.delete(subfeatures);
        await db.delete(features);

        // Dashboard
        const [dashboard] = await db.insert(features).values({
            code: 'dashboard',
            name: 'Dashboard',
            description: 'Painel principal de indicadores',
            path: '/dashboard',
            enabled: true,
            allowedRoles: ['ROOT', 'ADMIN', 'USER']
        }).returning();

        // Monitoring
        const [monitoring] = await db.insert(features).values({
            code: 'monitoring',
            name: 'Monitoramento',
            description: 'Gestão de servidores e serviços',
            path: '/servers',
            enabled: true,
            allowedRoles: ['ROOT', 'ADMIN']
        }).returning();

        await db.insert(subfeatures).values([
            {
                featureId: monitoring.id,
                code: 'monitoring-servers',
                name: 'Servidores',
                path: '/servers',
                enabled: true,
                allowedRoles: ['ROOT', 'ADMIN']
            },
            {
                featureId: monitoring.id,
                code: 'monitoring-services',
                name: 'Serviços',
                path: '/services',
                enabled: true,
                allowedRoles: ['ROOT', 'ADMIN']
            }
        ]);

        // Products
        const [products] = await db.insert(features).values({
            code: 'products',
            name: 'Produtos',
            description: 'Gestão de catálogo de produtos',
            path: '/products',
            enabled: false,
            allowedRoles: ['ROOT', 'ADMIN', 'USER']
        }).returning();

        await db.insert(subfeatures).values([
            {
                featureId: products.id,
                code: 'products-list',
                name: 'Ver Produtos',
                path: '/products',
                enabled: true,
                allowedRoles: ['ROOT', 'ADMIN', 'USER']
            },
            {
                featureId: products.id,
                code: 'products-inventory',
                name: 'Estoque',
                path: '/products/inventory',
                enabled: false,
                allowedRoles: ['ROOT', 'ADMIN']
            }
        ]);

        // Root Management
        await db.insert(features).values({
            code: 'root-management',
            name: 'Administração',
            description: 'Gestão de usuários e permissões do sistema',
            path: '/admin',
            enabled: true,
            allowedRoles: ['ROOT']
        });

        logger.info('✅ Features semeadas com sucesso!');
        process.exit(0);
    } catch (error: any) {
        logger.error('❌ Erro ao semear features:');
        logger.error(error.stack || error.message);
        process.exit(1);
    }
};

seedFeatures();
