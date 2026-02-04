import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';
import { config } from '../config/config';
import { logger } from '../utils/consoleLogger';

const { Pool } = pg;

const pool = new Pool({
    connectionString: config.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
export const connection = pool;

// Test connection and log status
pool.connect()
    .then((client: pg.PoolClient) => {
        logger.info('🏦 [DATABASE] Conectado com sucesso ao PostgreSQL');
        client.release();
    })
    .catch((err: Error) => {
        logger.error('❌ [DATABASE] Conexão falhou:', err.stack || err.message);
    });
