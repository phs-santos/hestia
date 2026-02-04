import { Request, Response } from 'express';
import { serviceConfigRepository } from '../db/repositories/serviceConfigRepository';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getAllServers = async (req: Request, res: Response) => {
    try {
        const allServers = await serviceConfigRepository.getAll({
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
        const server = await serviceConfigRepository.findById(id);
        if (!server) return sendError(res, 'Configuração de serviço não encontrada', 404);
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

        await serviceConfigRepository.update(id, data);

        return sendSuccess(res, null, 'Configuração de serviço atualizada com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const deleteServer = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await serviceConfigRepository.delete(id);
        return sendSuccess(res, null, 'Configuração de serviço deletada com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};
