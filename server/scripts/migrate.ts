import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '../db/index';
import { logger } from '../utils/consoleLogger';

const runMigrations = async () => {
    try {
        logger.info('🚀 Iniciando migrações...');

        await migrate(db, { migrationsFolder: './migrations' });

        logger.info('✅ Migrações aplicadas com sucesso!');
        process.exit(0);
    } catch (error: any) {
        logger.error('❌ Erro ao aplicar migrações:');
        logger.error(error.stack || error.message);
        process.exit(1);
    }
};

runMigrations();
