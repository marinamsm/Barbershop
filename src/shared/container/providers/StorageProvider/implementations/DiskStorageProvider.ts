import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

/* eslint-disable class-methods-use-this */
export default class DiskStorageProvider implements IStorageProvider {
    public async saveFile(filename: string): Promise<string> {
        await fs.promises.rename(
            path.resolve(uploadConfig.destinationPath, filename),
            path.resolve(uploadConfig.finalPath, filename),
        );
        return filename;
    }

    public async deleteFile(filename: string): Promise<void> {
        const filePath = path.resolve(uploadConfig.finalPath, filename);

        try {
            const fileExists = await fs.promises.stat(filePath);

            if (fileExists) {
                await fs.promises.unlink(filePath);
            }
        } catch (error) {
            console.error(error.message);
        }
    }
}
