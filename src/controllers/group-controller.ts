import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';

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
        res: Response<Group[] | { message: string }>
    ) => {
        const groups = await this.service.getAll();

        if (!groups.length) {
            res.status(404).json({ message: 'Groups not found' });
        } else {
            res.json(groups);
        }
    }

    public getGroupById = async (
        req: Request<{ id: string }>,
        res: Response<Group | { message: string }>
    ) => {
        const id = req.params.id;
        const user = await this.service.getGroupById(id);

        if (user === null) {
            res.status(404).json({ message: `Group with id ${id} not found` });
        } else {
            res.json(user);
        }
    }

    public createGroup = async (
        req: ValidatedRequest<GroupRequestSchema>,
        res: Response
    ) => {
        const group: GroupDTO = {
            ...req.body,
        };

        const id = await this.service.createGroup(group);

        if (id) {
            res.status(201).json({ message: `Group with id: ${id} created` });
        } else {
            res.status(404).json({ message: 'Could not create group' });
        }
    }

    public udateGroup = async (
        req: ValidatedRequest<GroupRequestSchema>,
        res: Response
    ) => {
        const user: GroupDTO = { ...req.body };
        const id = req.params.id;
        const result = await this.service.udateGroup(id, user);

        if (result) {
            res.status(200).json({ message: `Group with id: ${id} updated` });
        } else {
            res.status(404).json({ message: `Group with id ${id} not found` });
        }
    }

    public deleteGroup = async (
        req: Request<{ id: string }>,
        res: Response
    ) => {
        const id = req.params.id;
        const result = await this.service.deleteGroup(id);

        if (result) {
            res.status(200).json({ message: `Group with id: ${id} deleted` });
        } else {
            res.status(404).json({ message: `Group with id ${id} not found` });
        }
    }

    public addUsersToGroup = async (
        req: Request<{ id: string }, any, { userIds: number[] }>,
        res: Response
    ) => {
        const groupId = req.params.id;
        const userIds = [...req.body.userIds];

        const result = await this.service.addUsersToGroup(groupId, userIds);

        if (result) {
            res.status(201).json({ message: `Users ${userIds} added to group ${groupId}` });
        } else {
            res.status(404).json({ message: `Could not add users to group ${groupId}` });
        }
    }
}

export const groupController = new GroupController(groupService);
