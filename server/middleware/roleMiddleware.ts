import { Request, Response, NextFunction } from 'express';

// se ter o '*' na permissão, libera para todos autenticados
export default (requiredRole: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autorizado' });
        }

        const role = requiredRole.includes('*') || requiredRole.includes(req.user.role.toUpperCase());

        if (role) {
            return next();
        }

        return res.status(403).json({ error: 'Permissão negada' });
    };
};
