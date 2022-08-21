import { Query, Resolver, Mutation, Arg } from 'type-graphql';
import { baseDirectory } from '@/utils/constants';
import { multerUpload } from '@/middleware/multer.middleware';
import {
    Directory,
    DirectoryInput,
} from '@/graphql/directory/directory.schema';
import DirectoryService from '@/graphql/directory/directory.service';
import {
    DirectoryModel,
    DirectoryTreeModel,
} from '@/graphql/directory/directory.model';
import { FileModel, FileSchema } from '@/graphql/file/file.model';
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
        const directories = await this.DirectoryService.getDirectories({});
        const files = await this.FileService.getFiles({});
        const mergedFilesAndFolders = this.FileService.addFilesToDirectory(
            directories,
            files
        );
        const extractedDirectories =
            await this.DirectoryService.listDirectoriesInExtractedZip(
                mergedFilesAndFolders
            );
        return extractedDirectories;
    }

    @Mutation(() => Directory)
    async createDirectory(
        @Arg('input') input: DirectoryInput
    ): Promise<Directory | string> {
        const { directory_name, directory_path } = input;
        if (/(^[^/].*)(.*[/]$)/.exec(directory_path) === null) {
            //match "this/format/"
            return Promise.reject(
                'directory_path argument must end with a forward slash and must not precede with a forward slash'
            );
        }
        const newDirectory = await this.DirectoryService.createDirectory({
            directory_name,
            directory_path: `${directory_path}${directory_name}/`,
        });
        return newDirectory;
        // const data = await DirectoryModel.findById('63029fdf264d0c6b5638f583');
        // console.log(/(^[^/].*)(.*[/]$)/.exec(input.directory_path));
        // // return /(^[^/].*)(.*[/]$)/.exec(input.directory_path);
        // // return new Promise((resolve, reject) => {
        // //     resolve(
        // //         JSON.stringify(/(^[^/].*)(.*[/]$)/.exec(input.directory_path))
        // //         );
        // //     });
        // return JSON.stringify(/(^[^/].*)(.*[/]$)/.exec(input.directory_path));
    }

    @Mutation(() => Boolean)
    async uploadZip(
        @Arg('file', () => GraphQLUpload)
        file: FileUpload
    ): Promise<boolean> {
        const { createReadStream, filename, mimetype, encoding } = await file;
        const pathToDir = `${baseDirectory}/${filename}`;
        if (mimetype !== 'application/zip')
            return new Promise((_, reject) =>
                reject('Uploaded folder/file must be in a zip format')
            );
        return new Promise(async (resolve, reject) => {
            createReadStream()
                .pipe(createWriteStream(pathToDir))
                .on('finish', async () => {
                    //Read the uploaded zip file and save the returned json to db
                    const data = await this.DirectoryService.readZip(pathToDir);
                    const directories = data.filter((i) => i.isDirectory);
                    const files = data.filter((i) => !i.isDirectory);
                    DirectoryModel.create(
                        directories.map((i) =>
                            this.DirectoryService.formatDirectoryStructure(i)
                        )
                    );
                    FileModel.create(
                        files.map((i) =>
                            this.FileService.formatFileStructure(i)
                        )
                    );
                    // const mergedFilesAndFolders =
                    //     this.FileService.addFilesToDirectory(
                    //         data.filter((i) => i.isDirectory),
                    //         data.filter((i) => !i.isDirectory)
                    //     );
                    // const extractedDirectories =
                    //     await this.DirectoryService.listDirectoriesInExtractedZip(
                    //         mergedFilesAndFolders
                    //     );
                    // await DirectoryTreeModel.deleteMany({}); //TBD: clear the last uploaded and not all collections
                    // await DirectoryTreeModel.create({
                    //     directories: extractedDirectories,
                    // });
                    resolve(true);
                })
                .on('close', () => resolve(true))
                .on('error', () => reject(false));
        });
    }
}
