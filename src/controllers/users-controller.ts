import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import uniqid from 'uniqid';

import { UserRequestSchema } from '../interfaces/user-request-schema';
import { users } from '../mock-users';
import { User } from '../types/users';

export const getUsers = (_, res: Response<User[]>) => {
    res.json(users);
};

export const getUserById = (
    req: Request<{ id: string }>,
    res: Response<User | { message: string }>
) => {
    const id = req.params.id;
    const user = users.find((u: User) => u.id === id);

    if (user === undefined) {
        res.status(404).json({ message: `User with id ${id} not found` });
    } else {
        res.json(user);
    }
};

export const getAutoSuggestUsers = (
    req: Request<null, User[], null, { loginSubstring: string; limit: number }>,
    res: Response<User[]>
) => {
    const { loginSubstring, limit } = req.query;
    const response = users.filter((user: User) =>
        user.login.includes(loginSubstring)
    );

    res.json(response.slice(0, limit));
};

export const createUser = (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
    const id = uniqid();
    const user: User = {
        id,
        ...req.body,
        isDeleted: false,
    };
    users.push(user);

    res.sendStatus(201);
};

export const updateUser = (
    req: ValidatedRequest<UserRequestSchema>,
    res: Response
) => {
    const user = req.body;
    const id = req.params.id;
    const index = users.findIndex((u: User) => u.id === id);

    if (index === -1) {
        res.status(404).json({ message: `User with id ${id} not found` });
    } else {
        users[index] = {
            ...users[index],
            ...user,
        };
        res.sendStatus(204);
    }
};

export const deleteUser = (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    const index = users.findIndex((u: User) => u.id === id);

    if (index === -1) {
        res.status(404).json({ message: `User with id ${id} not found` });
    } else {
        users[index] = {
            ...users[index],
            isDeleted: true,
        };
        res.sendStatus(204);
    }
};
