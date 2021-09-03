import { userRepository } from '../repository';
import { userService } from '../services';

describe('UserService', () => {
    const user = {
        id: '1',
        login: 'test@test.com',
        password: '1234',
        age: 23,
        isDeleted: false,
    };
    const users = [
        user,
        {
            id: '2',
            login: 'test1@test.com',
            password: '12345',
            age: 30,
            isDeleted: true,
        },
    ];
    afterEach(jest.clearAllMocks);

    describe('getAll', () => {
        const getAllSpy = jest.spyOn(userRepository, 'getAll');

        it('should return not deleted users on success', async () => {
            getAllSpy.mockResolvedValueOnce(users);

            const res = await userService.getAll();

            expect(getAllSpy).toHaveBeenCalled();
            expect(res).toEqual([user]);
        });

        it('should return error on error', async () => {
            const error = { message: 'error' };
            getAllSpy.mockRejectedValueOnce(error);

            await expect(userService.getAll()).rejects.toEqual(error);
        });
    });

    describe('getUserById', () => {
        const getUserByIdSpy = jest.spyOn(userRepository, 'getUserById');

        it('should return user on success', async () => {
            getUserByIdSpy.mockResolvedValueOnce(user);

            const res = await userService.getUserById(1);

            expect(getUserByIdSpy).toHaveBeenCalled();
            expect(res).toEqual(user);
        });

        it('should return error on error', async () => {
            const error = { message: 'error' };
            getUserByIdSpy.mockRejectedValueOnce(error);

            await expect(userService.getUserById(1)).rejects.toEqual(error);
        });
    });

    describe('getAutoSuggestUsers', () => {
        const getAutoSuggestUsersSpy = jest.spyOn(
            userRepository,
            'getAutoSuggestUsers'
        );

        it('should return not deleted users on success', async () => {
            getAutoSuggestUsersSpy.mockResolvedValueOnce(users);

            const res = await userService.getAutoSuggestUsers(user.login, 1);

            expect(getAutoSuggestUsersSpy).toHaveBeenCalled();
            expect(res).toEqual([user]);
        });

        it('should return error on error', async () => {
            const error = { message: 'error' };
            getAutoSuggestUsersSpy.mockRejectedValueOnce(error);

            await expect(
                userService.getAutoSuggestUsers(user.login, 1)
            ).rejects.toEqual(error);
        });
    });

    describe('createUser', () => {
        const createUserSpy = jest.spyOn(userRepository, 'createUser');
        const createdUser = {
            login: 'test@test.com',
            password: '1234',
            age: 23,
        };

        it('should create user on success', async () => {
            createUserSpy.mockResolvedValueOnce(3);

            const res = await userService.createUser(createdUser);

            expect(createUserSpy).toHaveBeenCalled();
            expect(res).toBe(3);
        });

        it('should return error on error', async () => {
            const error = { message: 'error' };
            createUserSpy.mockRejectedValueOnce(error);

            await expect(userService.createUser(createdUser)).rejects.toEqual(
                error
            );
        });
    });

    describe('updateUser', () => {
        const updateUserSpy = jest.spyOn(userRepository, 'updateUser');
        const updatedUser = {
            login: 'test@test.com',
            password: '1234',
            age: 23,
        };

        it('should update user on success', async () => {
            updateUserSpy.mockResolvedValueOnce(4);

            const res = await userService.updateUser(4, updatedUser);

            expect(updateUserSpy).toHaveBeenCalled();
            expect(res).toBe(4);
        });

        it('should return error on error', async () => {
            const error = { message: 'error' };
            updateUserSpy.mockRejectedValueOnce(error);

            await expect(
                userService.updateUser(4, updatedUser)
            ).rejects.toEqual(error);
        });
    });

    describe('deleteUser', () => {
        const deleteUserSpy = jest.spyOn(userRepository, 'deleteUser');

        it('should delete user on success', async () => {
            deleteUserSpy.mockResolvedValueOnce(5);

            const res = await userService.deleteUser(5);

            expect(deleteUserSpy).toHaveBeenCalled();
            expect(res).toBe(5);
        });

        it('should return error on error', async () => {
            const error = { message: 'error' };
            deleteUserSpy.mockRejectedValueOnce(error);

            await expect(userService.deleteUser(5)).rejects.toEqual(error);
        });
    });

    describe('login', () => {
        const loginSpy = jest.spyOn(userRepository, 'login');

        it('should delete user on success', async () => {
            loginSpy.mockResolvedValueOnce(user);

            const res = await userService.login(user.login, user.password);

            expect(loginSpy).toHaveBeenCalled();
            expect(res).toEqual(user);
        });

        it('should return error on error', async () => {
            const error = { message: 'error' };
            loginSpy.mockRejectedValueOnce(error);

            await expect(
                userService.login(user.login, user.password)
            ).rejects.toEqual(error);
        });
    });
});
