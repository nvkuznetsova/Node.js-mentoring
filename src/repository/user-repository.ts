import { Op } from 'sequelize';

import { UserDataMapper, userMapper } from '../mappers';
import { User as UserModel } from '../models';
import { User, UserDto, UserEntity } from '../types/users';

export class UserRepository {
    private mapper: UserDataMapper;
    constructor(userDataMapper) {
        this.mapper = userDataMapper;
    }

    public async getAll(): Promise<User[]> {
        const users = await UserModel.findAll({
            attributes: ['id', 'login', 'password', 'age', 'isdeleted'],
        });

        return users.map((user: UserEntity) => this.mapper.toDomain(user));
    }

    public async getUserById(id: number): Promise<User> {
        const user = await UserModel.findOne({
            attributes: ['id', 'login', 'password', 'age', 'isdeleted'],
            where: { id },
        });

        return user ? this.mapper.toDomain(user) : null;
    }

    public async getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<User[]> {
        const users = await UserModel.findAll({
            attributes: ['id', 'login', 'password', 'age', 'isdeleted'],
            where: { login: { [Op.like]: `%${loginSubstring}%` } },
            limit,
        });

        return users.map((user: UserEntity) => this.mapper.toDomain(user));
    }

    public async createUser(user: UserDto): Promise<number> {
        const userEntity = this.mapper.toEntity({ ...user, isDeleted: false });
        const { id } = await UserModel.create(userEntity);

        return id;
    }

    public async updateUser(id: number, user: UserDto): Promise<number> {
        const userEntity = this.mapper.toEntity({ ...user });
        const [res] = await UserModel.update(userEntity, { where: { id } });

        return res;
    }

    public async deleteUser(id: number): Promise<number> {
        const [res] = await UserModel.update({ isdeleted: true }, { where: { id } });

        return res;
    }
}

export const userRepository = new UserRepository(userMapper);
