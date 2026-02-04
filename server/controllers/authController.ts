import jwt from 'jsonwebtoken';
import { userRepository } from '../db/repositories/userRepository';
import { config } from '../config/config';
import bcrypt from 'bcrypt';
import { logAction } from '../services/logger';
import { Request, Response } from 'express';
import { logger } from '../utils/consoleLogger';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) return sendError(res, 'Usuário já existe', 400);

        const quantityUsers = await userRepository.count();
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const role = quantityUsers === 0 ? 'ROOT' : 'USER';

        const newUser = await userRepository.create({ email, password_hash, name, role });
        await logAction(newUser.id, 'REGISTER', { email, name, role }, req);

        return sendSuccess(res, null, 'Usuário criado com sucesso', 201);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const loginEmail = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await userRepository.findByEmail(email);
        if (!user) return sendError(res, 'Credenciais inválidas', 400);

        const validPass = await bcrypt.compare(password, user.password_hash);
        if (!validPass) return sendError(res, 'Credenciais inválidas', 400);

        const token = jwt.sign(
            { id: user.id, email: user.email, nickname: user.nickname, role: user.role },
            config.JWT_SECRET,
            { expiresIn: '24h' }
        );

        await userRepository.update(user.id, { lastLogin: new Date() });
        await logAction(user.id, 'LOGIN_EMAIL', {
            id: user.id,
            nickname: user.nickname,
            name: user.name,
            email,
            role: user.role,
            token
        }, req);

        logger.info(`Usuário ${user.id} logado com sucesso`);

        const userResponse = {
            id: user.id,
            name: user.name,
            nickname: user.nickname,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return sendSuccess(res, { token, user: userResponse });
    } catch (error: any) {
        logger.error(`Erro ao fazer login: ${error.message}`);
        return sendError(res, error.message);
    }
};

export const loginNickname = async (req: Request, res: Response) => {
    try {
        const { nickname, password } = req.body;
        logger.info(`Usuário ${nickname} tentando fazer login`);

        const user = await userRepository.findByNickname(nickname);
        if (!user) return sendError(res, 'Credenciais inválidas', 400);

        logger.info(`Usuário ${user.id} encontrado`);

        const validPass = await bcrypt.compare(password, user.password_hash);
        if (!validPass) return sendError(res, 'Credenciais inválidas', 400);

        const token = jwt.sign(
            { id: user.id, email: user.email, nickname: user.nickname, role: user.role },
            config.JWT_SECRET,
            { expiresIn: '24h' }
        );

        await userRepository.update(user.id, { lastLogin: new Date() });
        await logAction(user.id, 'LOGIN_NICKNAME', {
            id: user.id,
            nickname,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        }, req);

        logger.info(`Usuário ${user.id} logado com sucesso`);

        const userResponse = {
            id: user.id,
            name: user.name,
            nickname: user.nickname,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return sendSuccess(res, { token, user: userResponse });
    } catch (error: any) {
        logger.error(`Erro ao fazer login: ${error.message}`);
        return sendError(res, error.message);
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const user = await userRepository.findById(userId);

        if (!user) return sendError(res, 'Usuário não encontrado', 404);

        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return sendSuccess(res, userResponse);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};
