import fs from 'fs';
import path from 'path';
import { ErrorResponse } from '@/utils/exceptions/http.exceptions';
import {
    FileEntry,
    IDirectory,
    ZipEntry,
} from '@/graphql/directory/directory.interface';
import { IFile } from '@/graphql/file/file.interface';
import { nanoid } from 'nanoid';
import { FilterQuery, QueryOptions } from 'mongoose';
import { FileModel } from '@/graphql/file/file.model';
class FileService {
    constructor() {}

    public formatFileStructure(file: FileEntry): IFile {
        return {
            file_name: file.name,
            file_dir: file.entryName,
            file_id: `file-${nanoid(10)}`,
            file_type: file.entryName.split('.').pop() || 'txt',
            file_content: file.fileContent || '',
            isDirectory: file.isDirectory,
        };
    }

    public addFilesToDirectory(
        directories: IDirectory[],
        files: IFile[]
    ): IDirectory[] {
        const mapped = directories.map((directory) => {
            files.forEach((file) => {
                if (
                    `${file.file_dir
                        .split('/')
                        .splice(0, file.file_dir.split('/').length - 1)
                        .join('/')}/` === directory.directory_path
                ) {
                    directory['files']?.push(file);
                }
            });

            return directory;
        });
        return mapped;
    }

    //MONGOOSE SERVICES
    public async getFiles(
        query: FilterQuery<IFile>,
        options: QueryOptions = { lean: true }
    ) {
        return FileModel.find(query, {}, options);
    }

    getDir(filePath: string) {
        let resolvedPath = path.resolve(filePath);
        return resolvedPath;
    }

    readFileContent(fileDir: string) {
        try {
            this.checkFileExists(fileDir);
            const fileType = path.extname(fileDir);
            const fileName = path.basename(fileDir);
            if (!fileType)
                throw new ErrorResponse('NO file in current Directory', 200);
            let buffer = fs.readFileSync(fileDir);
            let strData = buffer.toString();
            return {
                content:
                    fileType === '.json'
                        ? strData
                            ? JSON.parse(strData)
                            : '' /* check if json file is valid and has content */
                        : strData,
                fileName,
                fileType,
            };
        } catch (error) {
            throw error;
        }
    }

    readAllDir(dir: string) {
        let filenames = fs
            .readdirSync(dir, { withFileTypes: true })
            .filter((i) => !i.isDirectory());
        return filenames;
    }

    createFile(filePath: string, content: string) {
        try {
            const data = fs.writeFileSync(filePath, content);
            return data;
        } catch (error) {
            throw error;
        }
    }

    moveFile(from: string, to: string) {
        const source = fs.createReadStream(from);
        const destination = fs.createWriteStream(to);

        return new Promise((resolve, reject) => {
            source.on('end', resolve);
            source.on('error', reject);
            source.pipe(destination);
        });
    }

    deleteFileFromDirectory(dir: string) {
        try {
            this.checkFileExists(dir);
            // fs.rmdirSync(dir, { recursive: true });
            fs.unlinkSync(dir);
            return true;
        } catch (error) {
            throw error;
        } finally {
        }
    }

    renameFile(oldFileName: string, newFileName: string) {
        try {
            this.checkFileExists(oldFileName);
            fs.renameSync(oldFileName, newFileName);
            return true;
        } catch (error) {
            throw error;
        }
    }

    checkFileExists(fileDir: string) {
        try {
            fs.accessSync(fileDir, fs.constants.F_OK);
            return true;
        } catch (error) {
            throw new ErrorResponse("File doesn't exist", 200);
        }
    }
}

export default FileService;
