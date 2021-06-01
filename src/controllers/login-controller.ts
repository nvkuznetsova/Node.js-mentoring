import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { userService, UserService } from '../services';

import { logger } from './../loggers/logger';

class LoginController {
    private service: UserService;
    constructor(service: UserService) {
        this.service = service;
    }

    public logIn = async (
        req: Request<null, null, { login: string; password: string }>,
        res: Response<string | { message: string }>,
        next: NextFunction
    ) => {
        const { login, password } = req.body;

        try {
            const user = await this.service.login(login, password);
            res.locals.serviceMethod = 'userService.login';
            res.locals.args = { login, password };

            if (user === null) {
                res.status(403).json({ message: `User not found` });
            } else {
                const payload = { sub: user.id, login: user.login };
                const token = jwt.sign(payload, 'secret', {
                    expiresIn: 600000,
                });
                res.send(token);
            }

            next();
        } catch (err) {
            logger.error({
                method: 'userService.login',
                args: { login, password },
                message: err.message,
            });
            next(err);
        }
    };

    public checkToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['x-access-token'] as string;

        if (token) {
            jwt.verify(token, 'secret', (err, decoded) => {
                if (err) {
                    res.status(401).json({ message: 'Unauthorized access.' });
                } else {
                    next();
                }
            });
        } else {
            res.status(403).json({ message: 'No token provided.' });
        }
    }
}

export const loginController = new LoginController(userService);
