import path from 'path';
import { Router, Request, Response, NextFunction } from 'express';
import { ErrorResponse, handleError } from '@/utils/exceptions/http.exceptions';
import Controller from '@/utils/interfaces/controller.interface';

// import HttpException from '@/utils/exceptions/http.exception';
// import validationMiddleware from '@/middleware/validation.middleware';
// import validate from '@/resources/user/user.validation';
import FileService from '@/resources/file/file.service';
import DirectoryService from '@/resources/directory/directory.service';
import { baseDirectory } from '@/utils/constants.js';
// import authenticated from '@/middleware/authenticated.middleware';

class FileController implements Controller {
    public path = '/files';
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
        this.router.get(`${this.path}/`, this.getAllFiles);
        this.router.get(`${this.path}/get-file`, this.getFile);
        this.router.post(`${this.path}/create`, this.createFileController);
        this.router.post(`${this.path}/move`, this.moveFileController);
        this.router.patch(`${this.path}/rename`, this.renameFileController);
        this.router.delete(`${this.path}/delete`, this.deleteFileController);
    }

    private async getFile(req: Request, res: Response) {
        try {
            // const fileDir = getDir(req.query.
            const { content, fileName, fileType } =
                this.FileService.readFileContent(String(req.query.directory));

            res.status(200).json({
                file_content: content,
                file_type: fileType,
                file_name: fileName,
                file_dir: req.query.dir,
            });
        } catch (error) {
            const err = error as ErrorResponse;
            handleError(err, res);
        }
    }

    private async getAllFiles(req: Request, res: Response) {
        try {
            const fileDir = this.FileService.getDir(
                `${baseDirectory}/${req.query.directory}`
            );
            if (!this.DirectoryService.checkDirectoryExists(fileDir))
                throw new ErrorResponse('No such directory', 401);
            const files = this.FileService.readAllDir(fileDir);

            const fileContent: any = [];

            files.forEach((i) => {
                const { content, fileName, fileType } =
                    this.FileService.readFileContent(fileDir + '\\' + i.name);
                fileContent.push({
                    file_type: fileType,
                    file_name: fileName,
                    file_dir: `${fileDir}/${i.name}`,
                    file_content: content,
                });
            });
            res.status(200).json({ files: fileContent, file_dir: fileDir });
        } catch (error) {
            const err = error as ErrorResponse;
            handleError(err, res);
        }
    }

    private async createFileController(req: Request, res: Response) {
        try {
            const { output_dir, file_name, file_ext, content } = req.body;
            let OUTPUT_DIR = path.resolve(baseDirectory, output_dir);
            let OUTPUT_PATH = path.join(OUTPUT_DIR, `${file_name}${file_ext}`);
            if (!this.DirectoryService.checkDirectoryExists(OUTPUT_DIR))
                this.DirectoryService.createDirectory(OUTPUT_DIR); //if the directory doesn't exist, create new

            let data = this.FileService.createFile(OUTPUT_PATH, content);
            res.status(200).json({ success: true, data });
        } catch (error) {
            const err = error as ErrorResponse;
            handleError(err, res);
        }
    }

    private async moveFileController(req: Request, res: Response) {
        try {
            const { old_dir, new_dir } = req.body;
            // const oldPath = getDir(`${baseDir}/test.txt`);

            await this.FileService.moveFile(old_dir, new_dir);
            this.FileService.deleteFileFromDirectory(old_dir);
            res.status(201).json({ status: 'success' });
        } catch (error) {
            const err = error as ErrorResponse;
            handleError(err, res);
        }
    }

    private async renameFileController(req: Request, res: Response) {
        try {
            let oldFile = req.body.old_file_path;
            let oldFileName = path.basename(oldFile);
            let newFileName = req.body.new_file_name;
            let newFile = oldFile.replace(oldFileName, newFileName);
            if (oldFileName === newFileName)
                throw new ErrorResponse(
                    'Old file name cannot be the same as new file name',
                    400
                );
            if (this.FileService.renameFile(oldFile, newFile))
                return res.status(204).json('ok');
        } catch (error) {
            const err = error as ErrorResponse;
            handleError(err, res);
        }
    }

    private async deleteFileController(req: Request, res: Response) {
        try {
            this.FileService.deleteFileFromDirectory(req.body.file_dir);
            res.status(204).json('ok');
        } catch (error) {
            const err = error as ErrorResponse;
            handleError(err, res);
        }
    }
}

export default FileController;
