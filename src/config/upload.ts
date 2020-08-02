import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpPath = path.resolve(__dirname, '..', '..', 'tmp');
export default {
    destinationPath: tmpPath,
    storage: multer.diskStorage({
        destination: tmpPath,
        filename(request, file, callback) {
            const fileHash = crypto.randomBytes(10).toString('hex');
            const fileName = `${fileHash}-${file.originalname}`;

            callback(null, fileName);
        }
    })
}
