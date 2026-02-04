import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/consoleLogger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../../.env');
dotenv.config({ path: envPath });

export const config = {
    PORT: process.env.APP_PORT || 3001,
    DATABASE_URL: process.env.DATABASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_here',
    NODE_ENV: process.env.NODE_ENV || 'development',
};

if (!config.DATABASE_URL) {
    logger.warn('⚠️ ATENÇÃO: DATABASE_URL não está definido nas variáveis de ambiente.');
}

if (config.JWT_SECRET === 'your_jwt_secret_here') {
    logger.warn('⚠️ ATENÇÃO: JWT_SECRET está usando o valor padrão. Por favor, defina-o no seu arquivo .env.');
}
