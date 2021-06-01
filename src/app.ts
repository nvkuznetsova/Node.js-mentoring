import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { ExpressJoiError } from 'express-joi-validation';
import winston from 'winston';

import { LoggerData } from './interfaces/logger-data';
import { winstonLogger } from './loggers';
import { logger } from './loggers/logger';
import * as routes from './routers';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/users', routes.usersRouter);
app.use('/groups', routes.groupsRouter);
app.use('/error', (_, res, next) => next(new Error('error')));

app.use((_, res: Response) => {
    const data: LoggerData = {
        method: res.locals.serviceMethod,
        args: res.locals.args,
    };
    logger.log(data);
});
app.use(
    (
        // tslint:disable-next-line: no-any
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
        } else {
            winstonLogger.error('Internal Server Error', err);
            res.status(500).send('Internal Server Error');
        }
    }
);
app.use((_, res: Response) => {
    res.status(404).send('Not Found');
});
app.listen(port);

process.on('uncaughtException', (err) => {
    winstonLogger.exceptions.getTrace(err);
    process.exit(1);
});
