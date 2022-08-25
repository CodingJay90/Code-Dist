import path from 'path';
import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import FileService from '@/resources/file/file.service';
import DirectoryService from '@/resources/directory/directory.service';

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

    private initializeRoutes(): void {}
}

export default FileController;
