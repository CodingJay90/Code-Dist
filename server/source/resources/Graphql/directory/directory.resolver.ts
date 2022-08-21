import { Query, Resolver, Mutation, Arg } from 'type-graphql';
import { baseDirectory } from '@/utils/constants';
import { multerUpload } from '@/middleware/multer.middleware';
import { Directory } from '@/graphql/directory/directory.schema';
import DirectoryService from '@/graphql/directory/directory.service';
import DirectoryModel from '@/graphql/directory/directory.model';
import FileService from '@/graphql/file/file.service';
// import { finished } from 'stream/promises';

// import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload';
// @ts-ignore
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { finished } from 'stream/promises';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
// import FileUpload from 'graphql-upload/FileUpload.js';

@Resolver(() => Directory)
export class DirectoryResolver {
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
    }

    @Query(() => [Directory])
    async getDirectoryTree() {
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
        return extractedDirectories;
    }

    @Mutation(() => Boolean)
    async uploadZip(
        @Arg('file', () => GraphQLUpload)
        file: FileUpload
    ): Promise<boolean> {
        const { createReadStream, filename, mimetype, encoding } = await file;
        const pathToDir = `${baseDirectory}/${filename}`;
        console.log(file);
        return new Promise(async (resolve, reject) =>
            createReadStream()
                .pipe(createWriteStream(pathToDir))
                .on('finish', () => resolve(true))
                .on('close', () => resolve(true))
                .on('error', () => reject(false))
        );
    }
}
