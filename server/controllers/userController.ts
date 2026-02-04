import { Request, Response } from 'express';
import { userRepository } from '../db/repositories/userRepository';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await userRepository.getAll({
            id: true,
            name: true,
            nickname: true,
            email: true,
            role: true,
            lastLogin: true,
            createdAt: true,
        });
        return sendSuccess(res, allUsers);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const user = await userRepository.findById(id);
        if (!user) return sendError(res, 'User not found', 404);
        return sendSuccess(res, user);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const data = req.body;

        delete data.id;

        await userRepository.update(id, data);

        return sendSuccess(res, null, 'Usuário atualizado com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await userRepository.delete(id);
        return sendSuccess(res, null, 'Usuário deletado com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};
