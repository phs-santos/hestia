import jwt from 'jsonwebtoken';
import { userRepository } from '../db/repositories/userRepository';
import { config } from '../config/config';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/consoleLogger';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Não autorizado' });

    try {
        const verified: any = jwt.verify(token, config.JWT_SECRET);

        const user = await userRepository.findById(verified.id);

        if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

        req.user = {
            ...user
        };

        next();
    } catch (error: any) {
        logger.error("Erro no middleware de autenticação:", error.stack || error.message);
        res.status(403).json({ error: 'Token inválido' });
    }
};
