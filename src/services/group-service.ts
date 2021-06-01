import { UserGroup } from '../models';
import { GroupRepository, groupRepository } from '../repository';
import { Group, GroupDTO } from '../types/group';

export class GroupService {
    private repository: GroupRepository;
    constructor(repository: GroupRepository) {
        this.repository = repository;
    }

    public async getAll(): Promise<Group[]> {
        try {
            return await this.repository.getAll();
        } catch (err) {
            throw err;
        }
    }

    public async getGroupById(id: string): Promise<Group> {
        try {
            return await this.repository.getGroupById(id);
        } catch (err) {
            throw err;
        }
    }

    public async createGroup(group: GroupDTO): Promise<string> {
        try {
            return await this.repository.createGroup(group);
        } catch (err) {
            throw err;
        }
    }

    public async udateGroup(id: string, group: GroupDTO): Promise<string> {
        try {
            return await this.repository.udateGroup(id, group);
        } catch (err) {
            throw err;
        }
    }

    public async deleteGroup(id: string): Promise<number> {
        try {
            return this.repository.deleteGroup(id);
        } catch (err) {
            throw err;
        }
    }

    public async addUsersToGroup(
        groupId: string,
        userIds: number[]
    ): Promise<UserGroup[]> {
        try {
            return this.repository.addUsersToGroup(groupId, userIds);
        } catch (err) {
            throw err;
        }
    }
}

export const groupService = new GroupService(groupRepository);
