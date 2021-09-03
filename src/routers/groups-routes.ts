import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import { groupController, loginController } from '../controllers';

import { createUpdateGroupSchema } from './../functions/group-schema';

const groupsRouter = Router();
const validator = createValidator({ passError: true });

groupsRouter.use(loginController.checkToken);
groupsRouter.get('/', groupController.getGroups);
groupsRouter.get('/:id', groupController.getGroupById);
groupsRouter.post(
    '/create',
    validator.body(createUpdateGroupSchema()),
    groupController.createGroup
);
groupsRouter.put(
    '/update/:id',
    validator.body(createUpdateGroupSchema()),
    groupController.updateGroup
);
groupsRouter.delete('/delete/:id', groupController.deleteGroup);
groupsRouter.post('/addUsersToGroup/:id', groupController.addUsersToGroup);

export { groupsRouter };
