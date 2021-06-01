import { Group as GroupModel, UserGroup } from '../models';
import { sequelize } from '../models/connect';
import { Group } from '../types/group';

import { GroupDTO } from './../types/group';

export class GroupRepository {
    public async getAll(): Promise<Group[]> {
        try {
            const groups = await GroupModel.findAll({
                attributes: ['id', 'name', 'permissions'],
                include: 'users',
            });
            return groups;
        } catch (err) {
            throw err;
        }
    }

    public async getGroupById(id: string): Promise<Group> {
        try {
            const group = GroupModel.findByPk(id, {
                attributes: ['id', 'name', 'permissions'],
                include: 'users',
            });
            return group ? group : null;
        } catch (err) {
            throw err;
        }
    }

    public async createGroup(group: GroupDTO): Promise<string> {
        try {
            const { id } = await GroupModel.create(group);
            return id;
        } catch (err) {
            throw err;
        }
    }

    public async udateGroup(id: string, group: GroupDTO): Promise<string> {
        try {
            const [res] = await GroupModel.update(group, { where: { id } });
            return res ? id : null;
        } catch (err) {
            throw err;
        }
    }

    public async deleteGroup(id: string): Promise<number> {
        try {
            const res = await GroupModel.destroy({ where: { id } });
            return res;
        } catch (err) {
            throw err;
        }
    }

    public async addUsersToGroup(
        groupId: string,
        userIds: number[]
    ): Promise<UserGroup[]> {
        const groupUsers = userIds.map((id) => ({
            group_id: groupId,
            user_id: id,
        }));
        try {
            const res = await sequelize.transaction(
                async (t) =>
                    await UserGroup.bulkCreate(groupUsers, { transaction: t })
            );
            return res;
        } catch (err) {
            throw err;
        }
    }
}

export const groupRepository = new GroupRepository();
