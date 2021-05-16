import { DataTypes, Model } from 'sequelize';

import { UserEntity } from './../types/users';
import { sequelize } from './connect';

export class User extends Model<Partial<UserEntity>> implements UserEntity {
    public id: number;
    public login: string;
    public password: string;
    public age: number;
    public isdeleted: boolean;
}
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlphanumeric: true,
            },
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 4,
                max: 130,
            },
        },
        isdeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        modelName: 'users',
        sequelize,
        timestamps: false,
    }
);
