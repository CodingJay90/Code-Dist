import { Query, Resolver, Mutation, Arg } from 'type-graphql';
import { baseDirectory } from '@/utils/constants';
import { multerUpload } from '@/middleware/multer.middleware';
import {
    DeleteDirectoryInput,
    Directory,
    DirectoryInput,
    MoveDirectoryInput,
    RenameDirectoryInput,
} from '@/graphql/directory/directory.schema';
import DirectoryService from '@/graphql/directory/directory.service';
import {
    DirectoryModel,
    DirectoryTreeModel,
} from '@/graphql/directory/directory.model';
import { FileModel, FileSchema } from '@/graphql/file/file.model';
import FileService from '@/graphql/file/file.service';
// @ts-ignore
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { finished } from 'stream/promises';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import mongoose, { isValidObjectId, ObjectId } from 'mongoose';
import { IDirectory } from '@/graphql/directory/directory.interface';
import { removeTrailingSlash, transFormIdToMongooseId } from '@/utils/strings';
import {
    CreateFileInput,
    File,
    GetFileInput,
} from '@/graphql/file/file.schema';
import { IFile } from '@/graphql/file/file.interface';

@Resolver(() => File)
export class FileResolver {
    private DirectoryService = new DirectoryService();
    private FileService = new FileService();

    @Query(() => File)
    async getFile(@Arg('input') input: GetFileInput): Promise<IFile> {
        const id = transFormIdToMongooseId(input.id);
        const query = {
            $or: [{ directory_id: input.id }, { _id: id }], //query by directory_id or _id
        };
        const file = await this.FileService.getFile(query);
        if (!file) return Promise.reject('File not found');
        return file;
    }

    @Mutation(() => String)
    async createFile(@Arg('input') input: CreateFileInput): Promise<string> {
        const { file_name, file_dir } = input;
        const directoryToAddFile = await this.DirectoryService.getDirectory({
            directory_path: file_dir,
        });
        const formattedDir = removeTrailingSlash(file_dir);
        if (!directoryToAddFile)
            return Promise.reject("Directory doesn't exist");
        let newFileName = '';
        let newFileExt = '';
        if (file_name.split('.').length > 1) {
            //e.g example.js
            newFileExt = file_name.split('.').pop() || '';
            newFileName = file_name;
        }
        const newFileDir = `{formattedDir}/{newFileName}`;
        const fileExtension =
            file_name.split('.').length > 1 ? file_name.split('.').pop() : '';
        const createdFile = await this.FileService.createFile({
            file_dir: `${formattedDir}/${file_name}`,
            file_name,
            file_type: fileExtension || '',
        });
        return createdFile._id;
    }
}
