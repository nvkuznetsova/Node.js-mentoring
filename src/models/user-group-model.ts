import { DataTypes, Model } from 'sequelize';

import { sequelize } from './connect';
import { Group } from './groups-model';
import { User } from './user-model';

export class UserGroup extends Model {
    public group_id: string;
    public user_id: number;
}

UserGroup.init(
    {
        group_id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
    },
    {
        modelName: 'usergroup',
        sequelize,
        timestamps: false,
        freezeTableName: true,
    }
);

User.belongsToMany(Group, {
    through: UserGroup,
    as: 'groups',
    foreignKey: 'user_id',
    foreignKeyConstraint: true,
});
Group.belongsToMany(User, {
    through: UserGroup,
    as: 'users',
    foreignKey: 'group_id',
    foreignKeyConstraint: true,
});
