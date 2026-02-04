import { Response } from 'express';

/**
 * Standard API Response Format:
 * {
 *   data: any,
 *   error: boolean,
 *   message?: string
 * }
 */

export const sendSuccess = (res: Response, data: any = null, message?: string, status: number = 200) => {
    return res.status(status).json({
        data,
        error: false,
        message
    });
};

export const sendError = (res: Response, message: string, status: number = 500, data: any = null) => {
    return res.status(status).json({
        data,
        error: true,
        message
    });
};
