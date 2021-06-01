import { userRepository, UserRepository } from '../repository';
import { User, UserDto } from '../types/users';

export class UserService {
    private repository: UserRepository;
    constructor(repository: UserRepository) {
        this.repository = repository;
    }
    public async getAll(): Promise<User[]> {
        try {
            const users = await this.repository.getAll();

            return users.filter(({ isDeleted }) => !isDeleted);
        } catch (err) {
            throw err;
        }
    }

    public async getUserById(id: number): Promise<User> {
        try {
            return await this.repository.getUserById(id);
        } catch (err) {
            throw err;
        }
    }

    public async getAutoSuggestUsers(
        loginSubstring: string,
        limit: number
    ): Promise<User[]> {
        try {
            const users = await this.repository.getAutoSuggestUsers(
                loginSubstring,
                limit
            );

            return users.filter(({ isDeleted }) => !isDeleted);
        } catch (err) {
            throw err;
        }
    }

    public async createUser(user: UserDto): Promise<number> {
        try {
            return await this.repository.createUser(user);
        } catch (err) {
            throw err;
        }
    }

    public async updateUser(id: number, user: UserDto): Promise<number> {
        try {
            return await this.repository.updateUser(id, user);
        } catch (err) {
            throw err;
        }
    }

    public async deleteUser(id: number): Promise<number> {
        try {
            return await this.repository.deleteUser(id);
        } catch (err) {
            throw err;
        }
    }

    public async login(login: string, password: string): Promise<User> {
        try {
            const user = await this.repository.login(login, password);
            return !user.isDeleted ? user : null;
        } catch (err) {
            throw err;
        }
    }
}

export const userService = new UserService(userRepository);
