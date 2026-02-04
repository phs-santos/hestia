import { Request, Response } from 'express';
import { logRepository } from '../db/repositories/logRepository';

export const getAll = async (req: Request, res: Response) => {
    try {
        const logs = await logRepository.getAll();

        res.json({ logs });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
