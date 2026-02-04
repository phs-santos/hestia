import { Request, Response } from 'express';
import { serviceConfigRepository } from '../db/repositories/serviceConfigRepository';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const create = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const server = await serviceConfigRepository.create(data);
        return sendSuccess(res, server);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const allConfigs = await serviceConfigRepository.getAll();
        return sendSuccess(res, allConfigs);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const server = await serviceConfigRepository.findById(id);
        if (!server) return sendError(res, 'Configuração de serviço não encontrada', 404);
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

        await serviceConfigRepository.update(id, data);

        return sendSuccess(res, null, 'Configuração de serviço atualizada com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await serviceConfigRepository.delete(id);
        return sendSuccess(res, null, 'Configuração de serviço deletada com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};
