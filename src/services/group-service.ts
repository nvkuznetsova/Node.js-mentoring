import { GroupRepository, groupRepository } from '../repository';
import { Group, GroupDTO } from '../types/group';

export class GroupService {
    private repository: GroupRepository;
    constructor(repository: GroupRepository) {
        this.repository = repository;
    }

    public async getAll(): Promise<Group[]> {
        return await this.repository.getAll();
    }

    public async getGroupById(id: string): Promise<Group> {
        return await this.repository.getGroupById(id);
    }

    public async createGroup(group: GroupDTO): Promise<string> {
        return await this.repository.createGroup(group);
    }

    public async udateGroup(id: string, group: GroupDTO): Promise<string> {
        return await this.repository.udateGroup(id, group);
    }

    public async deleteGroup(id: string): Promise<number> {
        return this.repository.deleteGroup(id);
    }

    public async addUsersToGroup(
        groupId: string,
        userIds: number[]
    ): Promise<any> {
        return this.repository.addUsersToGroup(groupId, userIds);
    }
}

export const groupService = new GroupService(groupRepository);
