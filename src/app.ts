import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { ExpressJoiError } from 'express-joi-validation';

import * as routes from './routers';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/users', routes.usersRouter);
app.use('/groups', routes.groupsRouter);

// tslint:disable-next-line: no-any
app.use(
    (
        err: ExpressJoiError | any,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (err && err?.error?.isJoi) {
            res.status(400).json({
                type: err.type,
                message: err.error.toString(),
            });
        }
    }
);
app.use((_, res: Response) => {
    res.status(404).send('Not Found');
});
app.listen(port);
