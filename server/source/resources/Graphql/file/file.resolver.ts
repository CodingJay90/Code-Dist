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
import { File, GetDirectoryInput } from '@/graphql/file/file.schema';
import { IFile } from '@/graphql/file/file.interface';

@Resolver(() => File)
export class FileResolver {
    private DirectoryService = new DirectoryService();
    private FileService = new FileService();

    @Query(() => File)
    async getFile(@Arg('input') input: GetDirectoryInput): Promise<IFile> {
        const id = transFormIdToMongooseId(input.id);
        const query = {
            $or: [{ directory_id: input.id }, { _id: id }], //query by directory_id or _id
        };
        const file = await this.FileService.getFile(query);
        if (!file) return Promise.reject('File not found');
        return file;
    }
}
