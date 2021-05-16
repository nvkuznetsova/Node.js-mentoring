import { Group as GroupModel, UserGroup } from '../models';
import { sequelize } from '../models/connect';
import { Group } from '../types/group';

import { GroupDTO } from './../types/group';

export class GroupRepository {
    public async getAll(): Promise<Group[]> {
        const groups = await GroupModel.findAll({
            attributes: ['id', 'name', 'permissions'],
            include: 'users',
        });
        return groups;
    }

    public async getGroupById(id: string): Promise<Group> {
        const group = GroupModel.findByPk(id, {
            attributes: ['id', 'name', 'permissions'],
            include: 'users',
        });
        return group ? group : null;
    }

    public async createGroup(group: GroupDTO): Promise<string> {
        const { id } = await GroupModel.create(group);
        return id;
    }

    public async udateGroup(id: string, group: GroupDTO): Promise<string> {
        const [res] = await GroupModel.update(group, { where: { id } });
        return res ? id : null;
    }

    public async deleteGroup(id: string): Promise<number> {
        const res = await GroupModel.destroy({ where: { id } });
        return res;
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
            const res = await sequelize.transaction(async (t) =>
                await UserGroup.bulkCreate(groupUsers, { transaction: t })
            );
            return res;
        } catch (err) {
            // tslint:disable-next-line: no-console
            console.log(err);
        }
    }
}

export const groupRepository = new GroupRepository();
