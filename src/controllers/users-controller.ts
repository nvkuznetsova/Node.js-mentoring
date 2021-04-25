import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';

import { UserRequestSchema } from '../interfaces/user-request-schema';
import { userService } from '../services';
import { User, UserDto } from '../types/users';

export const getUsers = async (
    _,
    res: Response<User[] | { message: string }>
) => {
    const users = await userService.getAll();

    if (!users.length) {
        res.status(404).json({ message: 'Users not found' });
    } else {
        res.json(users);
    }
};

export const getUserById = async (
    req: Request<{ id: string }>,
    res: Response<User | { message: string }>
) => {
    const id = +req.params.id;
    const user = await userService.getUserById(id);

    if (user === null) {
        res.status(404).json({ message: `User with id ${id} not found` });
    } else {
        res.json(user);
    }
};

export const getAutoSuggestUsers = async (
    req: Request<null, User[], null, { loginSubstring: string; limit: number }>,
    res: Response<User[] | { message: string }>
) => {
    const { loginSubstring, limit } = req.query;
    const response = await userService.getAutoSuggestUsers(
        loginSubstring,
        limit
    );

    if (!response.length) {
        res.status(404).json({ message: 'Users not found' });
    } else {
        res.json(response);
    }
};

export const createUser = async (
    req: ValidatedRequest<UserRequestSchema>,
    res: Response
) => {
    const user: UserDto = {
        ...req.body,
    };

    const id = await userService.createUser(user);

    if (id) {
        res.status(201).json({ message: `User with id: ${id} created` });
    } else {
        res.status(404).json({ message: 'Could not create user' });
    }
};

export const updateUser = async (
    req: ValidatedRequest<UserRequestSchema>,
    res: Response
) => {
    const user: UserDto = { ...req.body };
    const id = +req.params.id;
    const result = await userService.updateUser(id, user);

    if (result) {
        res.status(200).json({ message: `User with id: ${id} updated` });
    } else {
        res.status(404).json({ message: `User with id ${id} not found` });
    }

};

export const deleteUser = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const id = +req.params.id;
    const result = await userService.deleteUser(id);

    if (result) {
        res.status(200).json({ message: `User with id: ${id} deleted` });
    } else {
        res.status(404).json({ message: `User with id ${id} not found` });
    }
};
