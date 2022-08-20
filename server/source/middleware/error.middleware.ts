import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '@/utils/exceptions/http.exceptions';

function errorMiddleware(
    error: ErrorResponse,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    const status = error.statusCode || 500;
    const message = error.message || 'Something went wrong!';

    res.status(status).send({
        status,
        message,
    });
}

export default errorMiddleware;
