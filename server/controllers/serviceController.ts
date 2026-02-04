import { Request, Response } from 'express';
import { serviceRepository } from '../db/repositories/serviceRepository';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const create = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const server = await serviceRepository.create(data);
        return sendSuccess(res, server);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const allServices = await serviceRepository.getAll();
        return sendSuccess(res, allServices);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const server = await serviceRepository.findById(id);
        if (!server) return sendError(res, 'Serviço não encontrado', 404);
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

        await serviceRepository.update(id, data);

        return sendSuccess(res, null, 'Serviço atualizado com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await serviceRepository.delete(id);
        return sendSuccess(res, null, 'Serviço deletado com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};
