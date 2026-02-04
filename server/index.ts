import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connection } from './db/index';
import { config } from './config/config';
import { extractInfo } from './utils/extractInfo';
import { setupSPA } from './middleware/spa';
import { logger } from './utils/consoleLogger';
import apiRoutes from './routes/api';

const app = express();
const PORT = config.PORT;

app.use(cors());
app.use(express.json());

// Middleware de logging personalizado
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`[${req.method}] ${req.url}`);
    const start = Date.now();
    const { method, url } = req;

    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const msg = `${method} ${url} ${status} (${duration}ms)`;

        if (status >= 500) {
            logger.error(msg);
        } else if (status >= 400) {
            logger.warn(msg);
        } else {
            logger.info(msg);
        }
    });

    next();
});

// Rotas
app.use('/api', apiRoutes);

// Servindo o build do cliente (opcional para template, mas mantido do original)
setupSPA(app);

// Bootstrap do servidor
(async () => {
    try {
        const client = await connection.connect();
        client.release();

        const dbInfo = extractInfo(config.DATABASE_URL);

        logger.info('🗄️  Banco de Dados');
        logger.info('──────────────────────────────────────');
        logger.info(`✔ Status      : CONECTADO`);
        logger.info(`✔ Host        : ${dbInfo?.host}`);
        logger.info(`✔ Database    : ${dbInfo?.database}`);
        logger.info('──────────────────────────────────────');

        app.listen(PORT, () => {
            logger.info('🌐 Servidor HTTP');
            logger.info('──────────────────────────────────────');
            logger.info(`✔ Status      : ONLINE`);
            logger.info(`✔ Porta       : ${PORT}`);
            logger.info('──────────────────────────────────────');
        });

    } catch (err: any) {
        logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        logger.error('❌ ERRO CRÍTICO NA INICIALIZAÇÃO');
        logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        logger.error(`💥 Motivo     : ${err.message}`);
        if (err.stack) {
            logger.error(`📄 Stack      : ${err.stack}`);
        }

        logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        process.exit(1);
    }
})();
