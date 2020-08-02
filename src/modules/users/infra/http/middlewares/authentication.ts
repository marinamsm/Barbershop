import {Request, Response, NextFunction} from 'express';
import {verify} from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function authenticate(request: Request, response: Response, next: NextFunction) {
    const { authorization } = request.headers;

    if(!authorization) {
        throw new AppError('Missing authorization token', 401);
    }

    // Bearen tokenifjpeaofpao
    const [, token] = authorization.split(' ');

    const {sub} = verify(token, authConfig.jwt.secret) as TokenPayload;

    request.user = {
        id: sub
    }

    return next();

}
