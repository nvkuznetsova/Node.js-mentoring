import { User, UserEntity } from './../types/users';
import { EntityDataMapper } from './entity-data-mapper';

export class UserDataMapper extends EntityDataMapper<User, UserEntity> {
    public toDomain(entity: UserEntity): User {
        return {
            id: `${entity.id}`,
            login: entity.login,
            password: entity.password,
            age: entity.age,
            isDeleted: entity.isdeleted,
            groups: entity?.groups,
        };
    }
    public toEntity(domain: Partial<User>): Partial<UserEntity> {
        return Reflect.ownKeys(domain).reduce(
            (entity: Partial<UserEntity>, key: string) => {
                const entityKey = key.toLocaleLowerCase();
                entity[entityKey] = domain[key];
                return entity;
            },
            {}
        );
    }
}

export const userMapper = new UserDataMapper();
