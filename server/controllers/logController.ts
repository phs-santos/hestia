import { Request, Response } from 'express';
import { logRepository } from '../db/repositories/logRepository';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getAll = async (req: Request, res: Response) => {
    try {
        const logs = await logRepository.getAll();

        return sendSuccess(res, { logs });
    } catch (error: any) {
        return sendError(res, error.message);
    }
};
