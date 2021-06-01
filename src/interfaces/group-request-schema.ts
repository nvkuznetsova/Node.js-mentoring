import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

import { GroupDTO } from './../types/group';

export interface GroupRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: GroupDTO;
}
