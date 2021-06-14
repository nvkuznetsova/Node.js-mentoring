import { NextFunction, Response } from 'express';

export const mockRes = (): Partial<Response> => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
    locals: {},
});

export const mockNext: NextFunction = jest.fn();
