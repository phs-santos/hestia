import { Request, Response } from 'express';
import { serviceRepository } from '../db/repositories/serviceRepository';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getAllServers = async (req: Request, res: Response) => {
    try {
        const allServers = await serviceRepository.getAll({
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
        const server = await serviceRepository.findById(id);
        if (!server) return sendError(res, 'Serviço não encontrado', 404);
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

        await serviceRepository.update(id, data);

        return sendSuccess(res, null, 'Serviço atualizado com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const deleteServer = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await serviceRepository.delete(id);
        return sendSuccess(res, null, 'Serviço deletado com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};
