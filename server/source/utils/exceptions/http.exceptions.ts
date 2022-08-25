import { Response } from 'express';

class ErrorResponse extends Error {
    public statusCode: number;
    public message: string;
    constructor(message: string, statusCode: number) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

function handleError(error: ErrorResponse, res: Response) {
    let statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: error.message,
        code: statusCode,
    });
}

export { ErrorResponse, handleError };
