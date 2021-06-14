import { Request, Response } from 'express';

import * as helpers from '../functions/test-helpers';
import { UserGroup } from '../models';
import { groupService } from '../services';
import { Group, GroupDTO } from '../types/group';

import { groupController } from './group-controller';

describe('Group Controller', () => {
    const group: Group = {
        id: '1',
        name: 'group',
        permissions: ['READ'],
    };
    afterEach(jest.clearAllMocks);

    describe('getGroups', () => {
        const getAllSpy = jest.spyOn(groupService, 'getAll');
        const res = helpers.mockRes() as Response<
            Group[] | { message: string }
        >;

        it('should return groups on success', async () => {
            const groups = [group];

            getAllSpy.mockResolvedValueOnce(groups);

            await groupController.getGroups(null, res, helpers.mockNext);

            expect(getAllSpy).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(groups);
        });

        it('should return 404 status if no groups found', async () => {
            getAllSpy.mockResolvedValueOnce([]);

            await groupController.getGroups(null, res, helpers.mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Groups not found',
            });
        });

        it('should return error on error', async () => {
            const error = Error('error');
            getAllSpy.mockRejectedValueOnce(error);

            await groupController.getGroups(null, res, helpers.mockNext);

            expect(helpers.mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getGroupById', () => {
        const getGroupByIdSpy = jest.spyOn(groupService, 'getGroupById');
        const res = helpers.mockRes() as Response<Group | { message: string }>;
        const req = { params: { id: '1' } } as Request<{ id: string }>;

        it('should return group on success', async () => {
            getGroupByIdSpy.mockResolvedValueOnce(group);

            await groupController.getGroupById(req, res, helpers.mockNext);

            expect(getGroupByIdSpy).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(group);
        });

        it('should return 404 status if no group found', async () => {
            getGroupByIdSpy.mockResolvedValueOnce(null);

            await groupController.getGroupById(req, res, helpers.mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Group with id 1 not found',
            });
        });

        it('should return error on error', async () => {
            const error = Error('error');
            getGroupByIdSpy.mockRejectedValueOnce(error);

            await groupController.getGroupById(req, res, helpers.mockNext);

            expect(helpers.mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('createGroup', () => {
        const createdGroup: GroupDTO = {
            name: 'group',
            permissions: ['READ', 'WRITE'],
        };
        const createGroupSpy = jest.spyOn(groupService, 'createGroup');
        const res = helpers.mockRes() as Response;
        const req = { body: createdGroup } as Request;

        it('should return 201 status on success', async () => {
            createGroupSpy.mockResolvedValueOnce('2');

            await groupController.createGroup(req, res, helpers.mockNext);

            expect(createGroupSpy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Group with id: 2 created',
            });
        });

        it('should return 404 status if no group created', async () => {
            createGroupSpy.mockResolvedValueOnce(null);

            await groupController.createGroup(req, res, helpers.mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Could not create group',
            });
        });

        it('should return error on error', async () => {
            const error = Error('error');
            createGroupSpy.mockRejectedValueOnce(error);

            await groupController.createGroup(req, res, helpers.mockNext);

            expect(helpers.mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('udateGroup', () => {
        const updatedGroup: GroupDTO = {
            name: 'group',
            permissions: ['READ', 'WRITE', 'UPLOAD_FILES'],
        };
        const updateGroupSpy = jest.spyOn(groupService, 'updateGroup');
        const res = helpers.mockRes() as Response;
        // tslint:disable-next-line: no-any
        const req = { body: updatedGroup, params: { id: '2' } } as any;

        it('should return 200 status on success', async () => {
            updateGroupSpy.mockResolvedValueOnce('2');

            await groupController.updateGroup(req, res, helpers.mockNext);

            expect(updateGroupSpy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Group with id: 2 updated',
            });
        });

        it('should return 404 status if no group found', async () => {
            updateGroupSpy.mockResolvedValueOnce(null);

            await groupController.updateGroup(req, res, helpers.mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Group with id 2 not found',
            });
        });

        it('should return error on error', async () => {
            const error = Error('error');
            updateGroupSpy.mockRejectedValueOnce(error);

            await groupController.updateGroup(req, res, helpers.mockNext);

            expect(helpers.mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteGroup', () => {
        const deleteGroupSpy = jest.spyOn(groupService, 'deleteGroup');
        const res = helpers.mockRes() as Response;
        const req = { params: { id: '2' } } as Request<{ id: string }>;

        it('should return 200 status on success', async () => {
            deleteGroupSpy.mockResolvedValueOnce(2);

            await groupController.deleteGroup(req, res, helpers.mockNext);

            expect(deleteGroupSpy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Group with id: 2 deleted',
            });
        });

        it('should return 404 status if no group found', async () => {
            deleteGroupSpy.mockResolvedValueOnce(null);

            await groupController.deleteGroup(req, res, helpers.mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Group with id 2 not found',
            });
        });

        it('should return error on error', async () => {
            const error = Error('error');
            deleteGroupSpy.mockRejectedValueOnce(error);

            await groupController.deleteGroup(req, res, helpers.mockNext);

            expect(helpers.mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('addUsersToGroup', () => {
        const addUsersToGroupSpy = jest.spyOn(groupService, 'addUsersToGroup');
        const res = helpers.mockRes() as Response;
        const req = {
            body: { userIds: [1, 2, 3] },
            params: { id: '2' },
        } as Request<{ id: string }, UserGroup[], { userIds: number[] }>;

        it('should return 201 status on success', async () => {
            const response = [
                { user_id: 1, group_id: '2' },
                { user_id: 2, group_id: '2' },
                { user_id: 3, group_id: '2' },
            ] as UserGroup[];
            addUsersToGroupSpy.mockResolvedValueOnce(response);

            await groupController.addUsersToGroup(req, res, helpers.mockNext);

            expect(addUsersToGroupSpy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Users 1,2,3 added to group 2',
            });
        });

        it('should return 404 status if could not add users to group', async () => {
            addUsersToGroupSpy.mockResolvedValueOnce([]);

            await groupController.addUsersToGroup(req, res, helpers.mockNext);

            expect(addUsersToGroupSpy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Could not add users to group 2',
            });
        });

        it('should return error on error', async () => {
            const error = Error('error');
            addUsersToGroupSpy.mockRejectedValueOnce(error);

            await groupController.addUsersToGroup(req, res, helpers.mockNext);

            expect(helpers.mockNext).toHaveBeenCalledWith(error);
        });
    });
});
