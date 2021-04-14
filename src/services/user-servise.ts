import { userRepository, UserRepository } from '../repository';
import { User, UserDto } from '../types/users';

class UserService {
    private repository: UserRepository;
    constructor(repository: UserRepository) {
        this.repository = repository;
    }
    public async getAll(): Promise<User[]> {
        const users = await this.repository.getAll();

        return users.filter(({ isDeleted }) => !isDeleted);
    }

    public async getUserById(id: number): Promise<User> {
        return await this.repository.getUserById(id);
    }

    public async getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<User[]> {
        const users = await this.repository.getAutoSuggestUsers(loginSubstring, limit);

        return users.filter(({ isDeleted }) => !isDeleted);
    }

    public async createUser(user: UserDto): Promise<number> {
        return await this.repository.createUser(user);
    }

    public async updateUser(id: number, user: UserDto): Promise<number> {
        return await this.repository.updateUser(id, user);
    }

    public async deleteUser(id: number): Promise<number> {
        return await this.repository.deleteUser(id);
    }
}

export const userService = new UserService(userRepository);
