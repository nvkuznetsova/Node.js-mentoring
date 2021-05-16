import { NextFunction, Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';

import { UserRequestSchema } from '../interfaces/user-request-schema';
import { userService } from '../services';
import { User, UserDto } from '../types/users';

import { logger } from './../loggers/logger';

export const getUsers = async (
    _,
    res: Response<User[] | { message: string }>,
    next: NextFunction
) => {
    try {
        const users = await userService.getAll();
        res.locals.serviceMethod = 'userService.getAll';
        res.locals.args = {};

        if (!users.length) {
            res.status(404).json({ message: 'Users not found' });
        } else {
            res.json(users);
        }

        next();
    } catch (err) {
        logger.error({
            method: 'userService.getAll',
            args: {},
            message: err.message,
        });
        next(err);
    }
};

export const getUserById = async (
    req: Request<{ id: string }>,
    res: Response<User | { message: string }>,
    next: NextFunction
) => {
    if (req.params.id === 'auto') {
        return next();
    }

    const id = +req.params.id;
    try {
        const user = await userService.getUserById(id);
        res.locals.serviceMethod = 'userService.getUserById';
        res.locals.args = { id };

        if (user === null) {
            res.status(404).json({ message: `User with id ${id} not found` });
        } else {
            res.json(user);
        }

        next();
    } catch (err) {
        logger.error({
            method: 'userService.getUserById',
            args: { id },
            message: err.message,
        });
        next(err);
    }
};

export const getAutoSuggestUsers = async (
    req: Request<null, User[], null, { loginSubstring: string; limit: number }>,
    res: Response<User[] | { message: string }>,
    next: NextFunction
) => {
    const { loginSubstring, limit } = req.query;
    try {
        const response = await userService.getAutoSuggestUsers(
            loginSubstring,
            limit
        );
        res.locals.serviceMethod = 'userService.getAutoSuggestUsers';
        res.locals.args = { loginSubstring, limit };

        if (!response.length) {
            res.status(404).json({ message: 'Users not found' });
        } else {
            res.json(response);
        }

        next();
    } catch (err) {
        logger.error({
            method: 'userService.getAutoSuggestUsers',
            args: { loginSubstring, limit },
            message: err.message,
        });
        next(err);
    }
};

export const createUser = async (
    req: ValidatedRequest<UserRequestSchema>,
    res: Response,
    next: NextFunction
) => {
    const user: UserDto = {
        ...req.body,
    };

    try {
        const id = await userService.createUser(user);
        res.locals.serviceMethod = 'userService.createUser';
        res.locals.args = user;

        if (id) {
            res.status(201).json({ message: `User with id: ${id} created` });
        } else {
            res.status(404).json({ message: 'Could not create user' });
        }

        next();
    } catch (err) {
        logger.error({
            method: 'userService.createUser',
            args: user,
            message: err.message,
        });
        next(err);
    }
};

export const updateUser = async (
    req: ValidatedRequest<UserRequestSchema>,
    res: Response,
    next: NextFunction
) => {
    const user: UserDto = { ...req.body };
    const id = +req.params.id;
    try {
        const result = await userService.updateUser(id, user);
        res.locals.serviceMethod = 'userService.updateUser';
        res.locals.args = { id, ...user };

        if (result) {
            res.status(200).json({ message: `User with id: ${id} updated` });
        } else {
            res.status(404).json({ message: `User with id ${id} not found` });
        }

        next();
    } catch (err) {
        logger.error({
            method: 'userService.updateUser',
            args: { id, ...user },
            message: err.message,
        });
        next(err);
    }
};

export const deleteUser = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    const id = +req.params.id;
    try {
        const result = await userService.deleteUser(id);
        res.locals.serviceMethod = 'userService.deleteUser';
        res.locals.args = { id };

        if (result) {
            res.status(200).json({ message: `User with id: ${id} deleted` });
        } else {
            res.status(404).json({ message: `User with id ${id} not found` });
        }

        next();
    } catch (err) {
        logger.error({
            method: 'userService.deleteUser',
            args: { id },
            message: err.message,
        });
        next(err);
    }
};
