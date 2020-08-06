import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

/* eslint-disable class-methods-use-this */
export default class FakeStorageProvider implements IStorageProvider {
    private files: string[];

    constructor() {
        this.files = [];
    }

    public async saveFile(filename: string): Promise<string> {
        this.files.push(filename);

        return filename;
    }

    public async deleteFile(filename: string): Promise<void> {
        this.files = this.files.filter(file => file !== filename);
    }
}
