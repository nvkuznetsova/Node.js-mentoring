import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import * as usersController from '../controllers';
import { createUpdateUserShema } from '../functions/user-schema';

const usersRouter = Router();
const validator = createValidator({ passError: true });

usersRouter.get('/', usersController.getUsers);
usersRouter.get('/auto', usersController.getAutoSuggestUsers);
usersRouter.get('/:id', usersController.getUserById);
usersRouter.post(
    '/create',
    validator.body(createUpdateUserShema()),
    usersController.createUser
);
usersRouter.put(
    '/update/:id',
    validator.body(createUpdateUserShema()),
    usersController.updateUser
);
usersRouter.delete('/delete/:id', usersController.deleteUser);

export { usersRouter };
