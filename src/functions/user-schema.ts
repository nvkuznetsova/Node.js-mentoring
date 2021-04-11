import Joi from 'joi';

import { UserDto } from '../types/users';

export const createUpdateUserShema = (): Joi.ObjectSchema<UserDto> => {
    return Joi.object({
        login: Joi.string().email().required(),
        password: Joi.string()
            .regex(/^[a-zA-Z0-9]*$/)
            .required(),
        age: Joi.number().min(4).max(130).required(),
    });
};
