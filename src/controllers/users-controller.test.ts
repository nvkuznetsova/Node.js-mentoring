import { Request, Response } from 'express';

import * as helpers from '../functions/test-helpers';
import { userService } from '../services';
import { User } from '../types/users';

import * as usersController from './users-controller';

describe('Users Controller', () => {
    const user = {
        id: '1',
        login: 'test@test.com',
        password: '1234',
        age: 23,
        isDeleted: false,
    };
    afterEach(jest.clearAllMocks);

    describe('getUsers', () => {
        const getAllSpy = jest.spyOn(userService, 'getAll');
        const res = helpers.mockRes() as Response<User[] | { message: string }>;

        it('should return users on success', async () => {
            const users = [user];

            getAllSpy.mockResolvedValueOnce(users);

            await usersController.getUsers(null, res, helpers.mockNext);

            expect(getAllSpy).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(users);
        });

        it('should return 404 status if no users found', async () => {
            getAllSpy.mockResolvedValueOnce([]);

            await usersController.getUsers(null, res, helpers.mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Users not found',
            });
        });

        it('should return error on error', async () => {
            const error = Error('error');
            getAllSpy.mockRejectedValueOnce(error);

            await usersController.getUsers(null, res, helpers.mockNext);

            expect(helpers.mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getUserById', () => {
        const getUserByIdSpy = jest.spyOn(userService, 'getUserById');
        const res = helpers.mockRes() as Response<User | { message: string }>;
        const req = { params: { id: '1' } } as Request<{ id: string }>;

        it('should return user on success', async () => {
            getUserByIdSpy.mockResolvedValueOnce(user);

            await usersController.getUserById(req, res, helpers.mockNext);

            expect(getUserByIdSpy).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it('should return 404 status if no user found', async () => {
            getUserByIdSpy.mockResolvedValueOnce(null);

            await usersController.getUserById(req, res, helpers.mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User with id: 1 not found',
            });
        });

        it('should return error on error', async () => {
            const error = Error('error');
            getUserByIdSpy.mockRejectedValueOnce(error);

            await usersController.getUserById(req, res, helpers.mockNext);

            expect(helpers.mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getAutoSuggestUsers', () => {
        const getAutoSuggestUsersSpy = jest.spyOn(
            userService,
            'getAutoSuggestUsers'
        );
        const res = helpers.mockRes() as Response<User[] | { message: string }>;
        const req = { query: { loginSubstring: '', limit: 1 } } as Request<
            null,
            User[],
            null,
            { loginSubstring: string; limit: number }
        >;

        it('should return users on success', async () => {
            getAutoSuggestUsersSpy.mockResolvedValueOnce([user]);

            await usersController.getAutoSuggestUsers(
                req,
                res,
                helpers.mockNext
            );

            expect(getAutoSuggestUsersSpy).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith([user]);
        });

        it('should return 404 status if no users found', async () => {
            getAutoSuggestUsersSpy.mockResolvedValueOnce([]);

            await usersController.getAutoSuggestUsers(
                req,
                res,
                helpers.mockNext
            );

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Users not found',
            });
        });

        it('should return error on error', async () => {
            const error = Error('error');
            getAutoSuggestUsersSpy.mockRejectedValueOnce(error);

            await usersController.getAutoSuggestUsers(
                req,
                res,
                helpers.mockNext
            );

            expect(helpers.mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('createUser', () => {
        const createdUser = {
            login: 'test@test.com',
            password: '1234',
            age: 23,
        };
        const createUserSpy = jest.spyOn(userService, 'createUser');
        const res = helpers.mockRes() as Response;
        const req = { body: createdUser } as Request;

        it('should return 201 status on success', async () => {
            createUserSpy.mockResolvedValueOnce(2);

            await usersController.createUser(req, res, helpers.mockNext);

            expect(createUserSpy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User with id: 2 created',
            });
        });

        it('should return 404 status if no user created', async () => {
            createUserSpy.mockResolvedValueOnce(null);

            await usersController.createUser(req, res, helpers.mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Could not create user',
            });
        });

        it('should return error on error', async () => {
            const error = Error('error');
            createUserSpy.mockRejectedValueOnce(error);

            await usersController.createUser(req, res, helpers.mockNext);

            expect(helpers.mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('updateUser', () => {
        const updatedUser = {
            login: 'test@test.com',
            password: '1234',
            age: 23,
        };
        const updateUserSpy = jest.spyOn(userService, 'updateUser');
        const res = helpers.mockRes() as Response;
        // tslint:disable-next-line: no-any
        const req = { body: updatedUser, params: { id: '2' } } as any;

        it('should return 200 status on success', async () => {
            updateUserSpy.mockResolvedValueOnce(2);

            await usersController.updateUser(req, res, helpers.mockNext);

            expect(updateUserSpy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User with id: 2 updated',
            });
        });

        it('should return 404 status if no user found', async () => {
            updateUserSpy.mockResolvedValueOnce(null);

            await usersController.updateUser(req, res, helpers.mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User with id: 2 not found',
            });
        });

        it('should return error on error', async () => {
            const error = Error('error');
            updateUserSpy.mockRejectedValueOnce(error);

            await usersController.updateUser(req, res, helpers.mockNext);

            expect(helpers.mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteUser', () => {
        const deleteUserSpy = jest.spyOn(userService, 'deleteUser');
        const res = helpers.mockRes() as Response;
        const req = { params: { id: '2' } } as Request<{ id: string }>;

        it('should return 200 status on success', async () => {
            deleteUserSpy.mockResolvedValueOnce(2);

            await usersController.deleteUser(req, res, helpers.mockNext);

            expect(deleteUserSpy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User with id: 2 deleted',
            });
        });

        it('should return 404 status if no user found', async () => {
            deleteUserSpy.mockResolvedValueOnce(null);

            await usersController.deleteUser(req, res, helpers.mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User with id: 2 not found',
            });
        });

        it('should return error on error', async () => {
            const error = Error('error');
            deleteUserSpy.mockRejectedValueOnce(error);

            await usersController.deleteUser(req, res, helpers.mockNext);

            expect(helpers.mockNext).toHaveBeenCalledWith(error);
        });
    });
});
