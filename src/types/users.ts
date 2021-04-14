export type User = {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
};

export type UserDto = {
    login: string;
    password: string;
    age: number;
};

export type UserEntity = {
    id: number;
    login: string;
    password: string;
    age: number;
    isdeleted: boolean;
};
