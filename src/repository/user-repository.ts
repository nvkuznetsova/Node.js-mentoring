import { Op } from 'sequelize';

import { UserDataMapper, userMapper } from '../mappers';
import { User as UserModel, UserGroup } from '../models';
import { sequelize } from '../models/connect';
import { User, UserDto, UserEntity } from '../types/users';

export class UserRepository {
    private mapper: UserDataMapper;
    constructor(userDataMapper) {
        this.mapper = userDataMapper;
    }

    public async getAll(): Promise<User[]> {
        try {
            const users = await UserModel.findAll({
                attributes: ['id', 'login', 'password', 'age', 'isdeleted'],
                include: 'groups',
            });

            return users.map((user: UserEntity) => this.mapper.toDomain(user));
        } catch (err) {
            throw err;
        }
    }

    public async getUserById(id: number): Promise<User> {
        try {
            const user = await UserModel.findOne({
                attributes: ['id', 'login', 'password', 'age', 'isdeleted'],
                where: { id },
                include: 'groups',
            });

            return user ? this.mapper.toDomain(user) : null;
        } catch (err) {
            throw err;
        }
    }

    public async getAutoSuggestUsers(
        loginSubstring: string,
        limit: number
    ): Promise<User[]> {
        try {
            const users = await UserModel.findAll({
                attributes: ['id', 'login', 'password', 'age', 'isdeleted'],
                where: { login: { [Op.like]: `%${loginSubstring}%` } },
                limit,
            });

            return users.map((user: UserEntity) => this.mapper.toDomain(user));
        } catch (err) {
            throw err;
        }
    }

    public async createUser(user: UserDto): Promise<number> {
        try {
            const userEntity = this.mapper.toEntity({
                ...user,
                isDeleted: false,
            });
            const { id } = await UserModel.create(userEntity);

            return id;
        } catch (err) {
            throw err;
        }
    }

    public async updateUser(id: number, user: UserDto): Promise<number> {
        try {
            const userEntity = this.mapper.toEntity({ ...user });
            const [res] = await UserModel.update(userEntity, { where: { id } });

            return res;
        } catch (err) {
            throw err;
        }
    }

    public async deleteUser(id: number): Promise<number> {
        try {
            const res = await sequelize.transaction(async (t) => {
                const [response] = await UserModel.update(
                    { isdeleted: true },
                    { where: { id }, transaction: t }
                );
                await UserGroup.destroy({
                    where: { user_id: id },
                    transaction: t,
                });

                return response;
            });

            return res;
        } catch (err) {
            throw err;
        }
    }

    public async login(login: string, password: string): Promise<User> {
        try {
            const user = await UserModel.findOne({
                attributes: ['id', 'login', 'password', 'age', 'isdeleted'],
                where: { login, password },
            });

            return user ? this.mapper.toDomain(user) : null;
        } catch (err) {
            throw err;
        }
    }
}

export const userRepository = new UserRepository(userMapper);
