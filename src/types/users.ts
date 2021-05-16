export type User = {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
    groups?: object[],
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
    groups?: object[];
};
