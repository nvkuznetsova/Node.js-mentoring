import { User } from '../models';

import { userRepository } from './user-repository';
jest.mock('sequelize');

describe('UserRepository', () => {
    const user = {
        id: 1,
        login: 'test@test.com',
        password: '1234',
        age: 23,
        isdeleted: false,
    } as User;

    const formattedUser = {
        id: '1',
        login: 'test@test.com',
        password: '1234',
        age: 23,
        isDeleted: false,
    };
    afterEach(jest.clearAllMocks);

    describe('getAll', () => {
        const findAllSpy = jest.spyOn(User, 'findAll');

        it('should return  users on success', async () => {
            findAllSpy.mockResolvedValueOnce([user]);

            const res = await userRepository.getAll();

            expect(findAllSpy).toHaveBeenCalled();
            expect(res).toEqual([formattedUser]);
        });

        it('should return error on error', async () => {
            const error = { message: 'error' };
            findAllSpy.mockRejectedValueOnce(error);

            await expect(userRepository.getAll()).rejects.toEqual(error);
        });
    });
});
