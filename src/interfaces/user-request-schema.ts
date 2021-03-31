import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

import { UserDto } from './../types/users';

export interface UserRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: UserDto;
}
