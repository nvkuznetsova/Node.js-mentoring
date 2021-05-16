import Joi from 'joi';

import { GroupDTO } from '../types/group';

export const createUpdateGroupSchema = (): Joi.ObjectSchema<GroupDTO> => {
    return Joi.object({
        name: Joi.string()
            .regex(/^[a-zA-Z0-9]*$/)
            .required(),
        permissions: Joi.array().items(Joi.string()).required(),
    });
};
