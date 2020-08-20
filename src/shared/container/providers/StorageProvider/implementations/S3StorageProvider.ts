import fs from 'fs';
import path from 'path';
import aws, { S3 } from 'aws-sdk';
import mime from 'mime';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

/* eslint-disable class-methods-use-this */
export default class DiskStorageProvider implements IStorageProvider {
    private client: S3;

    constructor() {
        this.client = new aws.S3({
            region: process.env.AWS_DEFAULT_REGION,
        });
    }

    public async saveFile(filename: string): Promise<string> {
        const originalPath = path.resolve(
            uploadConfig.destinationPath,
            filename,
        );
        const fileContent = await fs.promises.readFile(originalPath);

        const ContentType = mime.getType(filename);

        if (!ContentType) {
            throw new AppError('File not found');
        }

        await this.client
            .putObject({
                Bucket: uploadConfig.config.s3.bucket,
                Key: filename,
                ACL: 'public-read',
                Body: fileContent,
                ContentType,
                ContentDisposition: `inline; filename=${filename}`,
            })
            .promise();

        await fs.promises.unlink(originalPath);

        return filename;
    }

    public async deleteFile(filename: string): Promise<void> {
        await this.client
            .deleteObject({
                Bucket: uploadConfig.config.s3.bucket,
                Key: filename,
            })
            .promise();
    }
}
