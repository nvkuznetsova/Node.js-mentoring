import { DataTypes, Model } from 'sequelize';

import { Group as Groups, Permissions } from '../types/group';

import { sequelize } from './connect';

export class Group extends Model<Partial<Groups>> implements Groups {
    public id: string;
    public name: string;
    public permissions: Permissions[];
}

Group.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlphanumeric: true,
            },
        },
        permissions: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: false,
        },
    },
    {
        modelName: 'groups',
        sequelize,
        timestamps: false,
    }
);
