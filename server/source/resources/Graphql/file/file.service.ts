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
import {
    DocumentDefinition,
    FilterQuery,
    QueryOptions,
    UpdateQuery,
} from 'mongoose';
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
            isDirectory: file.isDirectory || false,
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

    public async getFile(
        query: FilterQuery<IFile>,
        options: QueryOptions = { lean: true }
    ) {
        return FileModel.findOne(query, {}, options);
    }

    public async createFile(
        input: DocumentDefinition<
            Pick<IFile, 'file_name' | 'file_dir' | 'file_type'>
        >
    ) {
        return FileModel.create(input);
    }

    public async findAndUpdate(
        query: FilterQuery<IFile>,
        update: UpdateQuery<IFile>,
        options?: QueryOptions
    ) {
        return FileModel.findOneAndUpdate(query, update, options);
    }

    public async deleteFile(query: FilterQuery<IFile>) {
        return FileModel.deleteOne(query);
    }
}

export default FileService;
