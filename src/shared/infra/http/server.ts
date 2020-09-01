import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';
import { errors } from 'celebrate';
import '@shared/infra/typeorm';
import 'express-async-errors';
import cors from 'cors';
import routes from '@shared/infra/http/routes';
import filesConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(filesConfig.finalPath));
app.use(rateLimiter);
app.use(routes);
app.use(errors());

app.use(
    (error: Error, request: Request, response: Response, _: NextFunction) => {
        if (error instanceof AppError) {
            return response.status(error.statusCode).json({
                status: 'error',
                message: error.message,
            });
        }

        console.error(error);

        return response.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    },
);

app.get('/', (request, response) => {
    return response.json({ message: 'Hello Woooorlld!!' });
});

app.listen(3333, () => {
    console.log('--- Listening on port 3333 ---');
});
