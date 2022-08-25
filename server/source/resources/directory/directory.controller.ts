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
        // this.DirectoryService.readZip();
    }

    private initializeRoutes(): void {
        this.router.get(`${this.path}/`, this.getAllDirectories);
        this.router.post(`${this.path}/create`, this.createDirectoryController);
        this.router.patch(
            `${this.path}/rename`,
            this.renameDirectoryController
        );
        this.router.post(`${this.path}/move`, this.moveDirectoryController);
        this.router.delete(
            `${this.path}/delete`,
            this.deleteDirectoryController
        );
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

    private async getAllDirectories(req: Request, res: Response) {
        try {
            const directories = await this.DirectoryService.listDirectories(
                baseDirectory
            );
            // console.log(directories, 'get all directories result');
            res.status(200).json({ root_dir: rootDir, directories });
        } catch (error) {
            const err = error as ErrorResponse;
            handleError(err, res);
        }
    }

    private async createDirectoryController(req: Request, res: Response) {
        try {
            let dir = path.resolve(baseDirectory, req.body.new_directory);
            this.DirectoryService.createDirectory(dir);
            res.status(201).json({ success: true });
        } catch (error) {
            const err = error as ErrorResponse;
            handleError(err, res);
        }
    }

    private async renameDirectoryController(req: Request, res: Response) {
        try {
            let oldPath = req.body.old_file_path;
            let oldDirectoryName = path.basename(oldPath);
            let newDirectoryName = req.body.new_directory_name;
            let newDirectory = oldPath.split('\\'); //oldFile.replace(oldDirectoryName, newDirectoryName);
            newDirectory[newDirectory.length - 1] = newDirectoryName;
            if (oldDirectoryName === newDirectoryName)
                throw new ErrorResponse(
                    'Old directory name cannot be the same as new directory name',
                    400
                );
            // res.send(oldDirectoryName);
            if (
                this.DirectoryService.renameDirectory(
                    oldPath,
                    newDirectory.join('\\')
                )
            )
                return res.status(204).json('ok');
        } catch (error) {
            const err = error as ErrorResponse;
            handleError(err, res);
        }
    }

    private async deleteDirectoryController(req: Request, res: Response) {
        try {
            this.DirectoryService.deleteDirectory(req.body.directory);
            res.status(204).json('ok');
        } catch (error) {
            const err = error as ErrorResponse;
            handleError(err, res);
        }
    }

    private async moveDirectoryController(req: Request, res: Response) {
        try {
            let { old_dir, new_dir } = req.body;
            let destination = path.basename(old_dir);
            let newDirPath = new_dir.concat(`\\${destination}`);
            // console.log("destination=====> ", destination);
            // console.log("newDirPath=====> ", newDirPath);
            this.DirectoryService.moveDirectory(old_dir, newDirPath);
            res.status(204).json('ok');
        } catch (error) {
            console.log(error, 'error');
            const err = error as ErrorResponse;
            handleError(err, res);
        }
    }
}

export default DirectoryController;
