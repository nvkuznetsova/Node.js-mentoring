export abstract class EntityDataMapper<T, K> {
    public abstract toDomain(entity: K): T;

    public abstract toEntity(domain: Partial<T>): Partial<K>;
}
