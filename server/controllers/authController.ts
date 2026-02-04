import jwt from 'jsonwebtoken';
import { userRepository } from '../db/repositories/userRepository';
import { config } from '../config/config';
import bcrypt from 'bcrypt';
import { logAction } from '../services/logger';
import { Request, Response } from 'express';
import { logger } from '../utils/consoleLogger';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) return res.status(400).json({ error: 'Usuário já existe' });

        const qunatityUsers = await userRepository.count();
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await userRepository.create({
            email,
            password_hash,
            name,
            role: qunatityUsers === 0 ? 'ROOT' : 'USER'
        });
        await logAction(newUser.id, 'REGISTER', {
            email,
            name,
            role: qunatityUsers === 0 ? 'ROOT' : 'USER'
        }, req);

        res.status(201).json({ message: 'Usuário criado com sucesso', userId: newUser.id });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const loginEmail = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await userRepository.findByEmail(email);
        if (!user) return res.status(400).json({ error: 'Credenciais inválidas' });

        const validPass = await bcrypt.compare(password, user.password_hash);
        if (!validPass) return res.status(400).json({ error: 'Credenciais inválidas' });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.JWT_SECRET,
            { expiresIn: '24h' }
        );

        await userRepository.update(user.id, { lastLogin: new Date() });
        await logAction(user.id, 'LOGIN', {
            email,
            role: user.role,
            token
        }, req);

        logger.info(`Usuário ${user.id} logado com sucesso`);
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error: any) {
        logger.error(`Erro ao fazer login: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const user = await userRepository.findById(userId);

        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        res.json({ user: userResponse });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
