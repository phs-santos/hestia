import { Request, Response } from 'express';
import { userRepository } from '../db/repositories/userRepository';
import { sendSuccess, sendError } from '../utils/apiResponse';
import bcrypt from 'bcrypt';

export const getAll = async (req: Request, res: Response) => {
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

export const getById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const user = await userRepository.findById(id);
        if (!user) return sendError(res, 'Usuário não encontrado', 404);
        return sendSuccess(res, user);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const update = async (req: Request, res: Response) => {
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

export const remove = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await userRepository.delete(id);
        return sendSuccess(res, null, 'Usuário deletado com sucesso');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const { email, password, name, role, nickname } = req.body;

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) return sendError(res, 'E-mail já cadastrado', 400);

        if (nickname) {
            const existingNick = await userRepository.findByNickname(nickname);
            if (existingNick) return sendError(res, 'Nickname já utilizado', 400);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password || 'Hestia@2024', salt);

        const newUser = await userRepository.create({
            email,
            passwordHash,
            name,
            role: role || 'USER',
            nickname: nickname || email.split('@')[0]
        });

        return sendSuccess(res, newUser, 'Usuário criado com sucesso', 201);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};
