export type Permissions =
    | 'READ'
    | 'WRITE'
    | 'DELETE'
    | 'SHARE'
    | 'UPLOAD_FILES';

export type Group = {
    id: string;
    name: string;
    permissions: Permissions[];
};

export type GroupDTO = {
    name: string;
    permissions: Permissions[];
};
