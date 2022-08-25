import path from 'path';
import { Router, Request, Response, NextFunction } from 'express';
import { ErrorResponse, handleError } from '@/utils/exceptions/http.exceptions';
import Controller from '@/utils/interfaces/controller.interface';
import FileService from '@/resources/file/file.service';
import DirectoryService from '@/resources/directory/directory.service';
import { baseDirectory } from '@/utils/constants';
import { multerUpload } from '@/middleware/multer.middleware';
import DirectoryModel from '@/resources/directory/directory.model';

let rootDir = path.resolve('./uploadedFiles');

class DirectoryController implements Controller {
    public path = '/directories';
    public router = Router();
    private DirectoryService = new DirectoryService();
    private FileService = new FileService();

    constructor() {
        let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        methods
            .filter((method) => method !== 'constructor')
            .forEach((method: string) => {
                let _this: { [key: string]: any } = this;
                _this[method] = _this[method].bind(this);
            });
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/upload`,
            multerUpload.single('folder_upload'),
            this.uploadDirectory
        );
        this.router.get(`${this.path}/read`, this.readDirectory);
    }

    private async uploadDirectory(req: Request, res: Response) {
        res.send('done');
    }
    private async readDirectory(req: Request, res: Response) {
        const start = new Date().getTime();
        const pathToDir = `${baseDirectory}/updated.zip`;
        const data = await this.DirectoryService.readZip(pathToDir);
        const mergedFilesAndFolders = this.FileService.addFilesToDirectory(
            data.filter((i) => i.isDirectory),
            data.filter((i) => !i.isDirectory)
        );
        const extractedDirectories =
            await this.DirectoryService.listDirectoriesInExtractedZip(
                mergedFilesAndFolders
            );
        await DirectoryModel.deleteMany({});
        await DirectoryModel.create({ directories: extractedDirectories });
        const end = new Date().getTime();
        const time = end - start;
        res.status(200).json({
            // files: mergedFilesAndFolders,
            data: extractedDirectories,
            time,
        });
    }
}

export default DirectoryController;
