import { Request } from 'express';
import multer from 'multer';
import { baseDirectory } from '@/utils/constants.js';

const storage = multer.diskStorage({
    destination: function (
        req,
        file,
        cb: (error: Error | null, destination: string) => void
    ) {
        cb(null, './uploadedFiles');
    },

    filename: function (
        req: Request,
        file: any,
        cb: (error: Error | null, destination: string) => void
    ) {
        console.log(file, 'file');
        cb(null, file.originalname);
    },
});

const fileFilter = (req: Request, file: any, cb: any) => {
    if (
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Image uploaded is not of type jpg/jpeg or png'), false);
    }
};
const multerUpload = multer({ storage: storage });
// const multerUpload = multer({ dest: 'uploadedFiles' });

export { multerUpload };
