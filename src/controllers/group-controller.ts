import { NextFunction, Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';

import { logger } from '../loggers';
import { UserGroup } from '../models';
import { GroupService } from '../services';
import { Group, GroupDTO } from '../types/group';

import { GroupRequestSchema } from './../interfaces/group-request-schema';
import { groupService } from './../services/group-service';

class GroupController {
    private service: GroupService;
    constructor(service: GroupService) {
        this.service = service;
    }

    public getGroups = async (
        _,
        res: Response<Group[] | { message: string }>,
        next: NextFunction
    ) => {
        try {
            const groups = await this.service.getAll();
            res.locals.serviceMethod = 'groupService.getAll';
            res.locals.args = {};

            if (!groups.length) {
                res.status(404).json({ message: 'Groups not found' });
            } else {
                res.json(groups);
            }

            next();
        } catch (err) {
            logger.error({
                method: 'groupService.getAll',
                args: {},
                message: err.message,
            });
            next(err);
        }
    }

    public getGroupById = async (
        req: Request<{ id: string }>,
        res: Response<Group | { message: string }>,
        next: NextFunction
    ) => {
        const id = req.params.id;

        try {
            const user = await this.service.getGroupById(id);
            res.locals.serviceMethod = 'groupService.getGroupById';
            res.locals.args = { id };

            if (user === null) {
                res.status(404).json({
                    message: `Group with id ${id} not found`,
                });
            } else {
                res.json(user);
            }
            next();
        } catch (err) {
            logger.error({
                method: 'groupService.getGroupById',
                args: { id },
                message: err.message,
            });
            next(err);
        }
    }

    public createGroup = async (
        req: ValidatedRequest<GroupRequestSchema>,
        res: Response,
        next: NextFunction
    ) => {
        const group: GroupDTO = {
            ...req.body,
        };

        try {
            const id = await this.service.createGroup(group);
            res.locals.serviceMethod = 'groupService.createGroup';
            res.locals.args = group;

            if (id) {
                res.status(201).json({
                    message: `Group with id: ${id} created`,
                });
            } else {
                res.status(404).json({ message: 'Could not create group' });
            }
            next();
        } catch (err) {
            logger.error({
                method: 'groupService.createGroup',
                args: group,
                message: err.message,
            });
            next(err);
        }
    }

    public updateGroup = async (
        req: ValidatedRequest<GroupRequestSchema>,
        res: Response,
        next: NextFunction
    ) => {
        const group: GroupDTO = { ...req.body };
        const id = req.params.id;

        try {
            const result = await this.service.updateGroup(id, group);
            res.locals.serviceMethod = 'groupService.udateGroup';
            res.locals.args = { id, ...group };

            if (result) {
                res.status(200).json({
                    message: `Group with id: ${id} updated`,
                });
            } else {
                res.status(404).json({
                    message: `Group with id ${id} not found`,
                });
            }
            next();
        } catch (err) {
            logger.error({
                method: 'groupService.udateGroup',
                args: { id, ...group },
                message: err.message,
            });
            next(err);
        }
    }

    public deleteGroup = async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const id = req.params.id;

        try {
            const result = await this.service.deleteGroup(id);
            res.locals.serviceMethod = 'groupService.deleteGroup';
            res.locals.args = { id };

            if (result) {
                res.status(200).json({
                    message: `Group with id: ${id} deleted`,
                });
            } else {
                res.status(404).json({
                    message: `Group with id ${id} not found`,
                });
            }
            next();
        } catch (err) {
            logger.error({
                method: 'groupService.deleteGroup',
                args: { id },
                message: err.message,
            });
            next(err);
        }
    }

    public addUsersToGroup = async (
        req: Request<{ id: string }, UserGroup[], { userIds: number[] }>,
        res: Response,
        next: NextFunction
    ) => {
        const groupId = req.params.id;
        const userIds = [...req.body.userIds];

        try {
            const result = await this.service.addUsersToGroup(groupId, userIds);
            res.locals.serviceMethod = 'groupService.addUsersToGroup';
            res.locals.args = { groupId, userIds };

            if (result.length) {
                res.status(201).json({
                    message: `Users ${userIds} added to group ${groupId}`,
                });
            } else {
                res.status(404).json({
                    message: `Could not add users to group ${groupId}`,
                });
            }
            next();
        } catch (err) {
            logger.error({
                method: 'groupService.addUsersToGroup',
                args: { groupId, userIds },
                message: err.message,
            });
            next(err);
        }
    }
}

export const groupController = new GroupController(groupService);
