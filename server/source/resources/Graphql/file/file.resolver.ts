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
    DeleteFileInput,
    File,
    GetFileInput,
    MoveFileInput,
    RenameFileInput,
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
        const fileExtension =
            file_name.split('.').length > 1 ? file_name.split('.').pop() : '';
        const createdFile = await this.FileService.createFile({
            file_dir: `${formattedDir}/${file_name}`,
            file_name,
            file_type: fileExtension || '',
        });
        return createdFile._id;
    }

    @Mutation(() => String)
    async renameFile(@Arg('input') input: RenameFileInput): Promise<string> {
        const { file_name, file_id } = input;
        const id = transFormIdToMongooseId(file_id);
        const query = {
            $or: [{ file_id }, { _id: id }], //query by directory_id or _id
        };
        const file = await this.FileService.getFile(query);
        if (!file) return Promise.reject('File not found');
        const newFileDir = removeTrailingSlash(file.file_dir).split('/');
        newFileDir.pop();
        const fileExtension =
            file_name.split('.').length > 1 ? file_name.split('.').pop() : '';
        await this.FileService.findAndUpdate(query, {
            file_name,
            file_type: fileExtension,
            file_dir: `${newFileDir.join('/')}/${file_name}`,
        });
        return file._id;
    }

    @Mutation(() => Boolean)
    async deleteFile(@Arg('input') input: DeleteFileInput): Promise<boolean> {
        const id = transFormIdToMongooseId(input.file_id);
        const query = {
            $or: [{ file_id: input.file_id }, { _id: id }], //query by directory_id or _id
        };
        const file = await this.FileService.getFile(query);
        if (!file) return Promise.reject('File not found');
        await this.FileService.deleteFile(query);
        return true;
    }

    @Mutation(() => Boolean)
    async moveFile(@Arg('input') input: MoveFileInput): Promise<boolean> {
        try {
            const { destination_path, file_id } = input;
            const id = transFormIdToMongooseId(input.file_id);
            const query = {
                $or: [{ file_id: input.file_id }, { _id: id }], //query by directory_id or _id
            };
            const file = await this.FileService.getFile(query);
            if (!file) return Promise.reject('File not found');
            const newFileDir = removeTrailingSlash(destination_path);

            await this.FileService.findAndUpdate(query, {
                file_dir: `${newFileDir}/${file.file_name}`,
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}
