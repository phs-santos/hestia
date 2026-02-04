import { Request, Response } from 'express';
import { serverRepository } from '../db/repositories/serverRepository';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getAllServers = async (req: Request, res: Response) => {
    try {
        const allServers = await serverRepository.getAll({
            id: true,
            name: true,
            nickname: true,
            email: true,
            role: true,
            lastLogin: true,
            createdAt: true,
        });

        return sendSuccess(res, allServers);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const getServerById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const server = await serverRepository.findById(id);
        if (!server) return sendError(res, 'Servidor não encontrado', 404);
        return sendSuccess(res, server);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const updateServer = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const data = req.body;

        delete data.id;

        await serverRepository.update(id, data);

        return sendSuccess(res, null, 'Servidor atualizado com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const deleteServer = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await serverRepository.delete(id);
        return sendSuccess(res, null, 'Servidor deletado com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};
