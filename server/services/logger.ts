import { logRepository } from '../db/repositories/logRepository';
import { Request } from 'express';
import { logger } from '../utils/consoleLogger';

export const logAction = async (userId: string | null, action: string, details: any = {}, req: Request | null = null) => {
    try {
        const ipAddress = req ? (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress) : null;

        await logRepository.create({
            userId,
            action,
            details: JSON.stringify(details),
            ipAddress
        });
    } catch (error: any) {
        logger.error('Failed to write audit log:', error.stack || error.message);
    }
};
