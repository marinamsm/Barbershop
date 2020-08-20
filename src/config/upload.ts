import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

interface IStorageConfig {
    driver: 's3' | 'disk';
    destinationPath: string;
    finalPath: string;
    multer: {
        storage: StorageEngine;
    };
    config: {
        disk: Record<string, unknown>;
        s3: {
            bucket: string;
        };
    };
}

const tmpPath = path.resolve(__dirname, '..', '..', 'tmp');

export default {
    driver: process.env.STORAGE_DRIVER,
    destinationPath: tmpPath,
    finalPath: path.resolve(tmpPath, 'uploads'),
    multer: {
        storage: multer.diskStorage({
            destination: tmpPath,
            filename(request, file, callback) {
                const fileHash = crypto.randomBytes(10).toString('hex');
                const fileName = `${fileHash}-${file.originalname}`;

                callback(null, fileName);
            },
        }),
    },
    config: {
        disk: {},
        s3: {
            bucket: process.env.S3_BUCKET_UPLOAD,
        },
    },
} as IStorageConfig;
