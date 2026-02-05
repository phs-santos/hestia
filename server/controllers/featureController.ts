import { Request, Response } from 'express';
import { featureRepository } from '../db/repositories/featureRepository';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getAllFeatures = async (req: Request, res: Response) => {
    try {
        const features = await featureRepository.findAll();
        return sendSuccess(res, features);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const getFeatureByCode = async (req: Request, res: Response) => {
    try {
        const code = req.params.code;
        if (typeof code !== 'string') return sendError(res, 'Código inválido', 400);
        const feature = await featureRepository.findByCode(code as string);
        if (!feature) return sendError(res, 'Feature não encontrada', 404);
        return sendSuccess(res, feature);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const updateFeature = async (req: Request, res: Response) => {
    try {
        const code = req.params.code as string;
        const data = req.body;
        await featureRepository.update(code, data);
        return sendSuccess(res, null, 'Feature atualizada com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const createFeature = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const feature = await featureRepository.create(data);
        return sendSuccess(res, feature, 'Feature criada com sucesso', 201);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const removeFeature = async (req: Request, res: Response) => {
    try {
        const code = req.params.code as string;
        await featureRepository.delete(code);
        return sendSuccess(res, null, 'Feature removida com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const createSubfeature = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const subfeature = await featureRepository.createSubfeature(data);
        return sendSuccess(res, subfeature, 'Subfeature criada com sucesso', 201);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const removeSubfeature = async (req: Request, res: Response) => {
    try {
        const code = req.params.code as string;
        await featureRepository.deleteSubfeature(code);
        return sendSuccess(res, null, 'Subfeature removida com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};
