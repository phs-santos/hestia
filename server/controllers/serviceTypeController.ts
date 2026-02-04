import { Request, Response } from 'express';
import { serviceTypeRepository } from '../db/repositories/serviceTypeRepository';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const create = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const server = await serviceTypeRepository.create(data);
        return sendSuccess(res, server);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const allServers = await serviceTypeRepository.getAll({
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

export const getById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const server = await serviceTypeRepository.findById(id);
        if (!server) return sendError(res, 'Tipo de serviço não encontrado', 404);
        return sendSuccess(res, server);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const data = req.body;

        delete data.id;

        await serviceTypeRepository.update(id, data);

        return sendSuccess(res, null, 'Tipo de serviço atualizado com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await serviceTypeRepository.delete(id);
        return sendSuccess(res, null, 'Tipo de serviço deletado com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};
