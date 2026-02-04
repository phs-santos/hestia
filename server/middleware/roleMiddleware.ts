import { Request, Response, NextFunction } from 'express';

export default (requiredRole: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autorizado' });
        }

        const role = requiredRole.includes(req.user.role.toUpperCase());

        if (role) {
            return next();
        }

        return res.status(403).json({ error: 'Permissão negada' });
    };
};
