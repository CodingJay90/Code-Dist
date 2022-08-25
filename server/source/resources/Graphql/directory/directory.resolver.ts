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
        // const unique = [
        //     ...new Map(
        //         extractedDirectories.map((i) => [i.directory_name, i])
        //     ).values(),
        // ];
        const newArray = extractedDirectories.map((m) => [m.directory_path, m]);
        const newMap = new Map(newArray as any);
        const iterator = newMap.values();
        const unique = [...(iterator as any)]; //this will only work when using es2015 or higher (set ""downlevelIteration": true" in tsconfig.json to use when target is lower than 3s2015)

        return unique;
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
                    resolve(true);
                })
                .on('close', () => resolve(true))
                .on('error', () => reject(false));
        });
    }

    @Mutation(() => String)
    async createDirectory(
        @Arg('input') input: DirectoryInput
    ): Promise<string> {
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
        return newDirectory._id;
    }

    @Mutation(() => String)
    async renameDirectory(
        @Arg('input') input: RenameDirectoryInput
    ): Promise<string> {
        const { directory_name, _id } = input;
        if (/(^[^/].*)(.*[^/]$)/.exec(directory_name) === null) {
            //must not include slashes
            return Promise.reject('directory_name must not include slashes');
        }
        const id = transFormIdToMongooseId(_id);
        const query = {
            $or: [{ directory_id: _id }, { _id: id }], //query by directory_id or _id
        };
        const directory = await this.DirectoryService.getDirectory(query);
        if (!directory)
            return Promise.reject('Directory with the given id not found');
        const splits = directory?.directory_path.split('/') || [];
        splits.pop();
        splits[splits.length - 1] = directory_name;
        console.log(splits.join('/'));
        const updatedDirectory = await this.DirectoryService.findAndUpdate(
            query,
            {
                directory_path: splits.join('/'),
                directory_name,
            }
            // { new: true }
        );
        return updatedDirectory?.directory_path || '';
    }

    @Mutation(() => Boolean)
    async deleteDirectory(
        @Arg('input') input: DeleteDirectoryInput
    ): Promise<boolean> {
        const id = transFormIdToMongooseId(input._id);
        const query = {
            $or: [{ directory_id: input._id }, { _id: id }], //query by directory_id or _id
        };
        const directory = await this.DirectoryService.getDirectory(query);
        if (!directory)
            return Promise.reject('Directory with the given id not found');
        await this.DirectoryService.deleteDirectory(query);
        return true;
    }

    @Mutation(() => [Directory])
    async moveDirectory(@Arg('input') input: MoveDirectoryInput): Promise<any> {
        let { destination_path, from_id } = input;
        destination_path = removeTrailingSlash(destination_path);
        const id = transFormIdToMongooseId(from_id);
        const query = {
            $or: [{ directory_id: id }, { _id: id }], //query by directory_id or _id
        };
        const directoryToMove = await this.DirectoryService.getDirectory(query); //get the directory to move
        const directories = await this.DirectoryService.getDirectories({});
        const files = await this.FileService.getFiles({});
        if (!directoryToMove)
            return Promise.reject('Directory with the given id not found');
        const from = removeTrailingSlash(directoryToMove.directory_path).split(
            '/'
        );
        const dest = destination_path.split('/');
        const currentDirectoryName = from[from.length - 1];
        const newDirectory = `${`${dest.join('/')}/`.concat(
            currentDirectoryName
        )}/`; // /newly/updated/path/

        const filteredDirectories = directories
            .filter((i) =>
                i.directory_path.includes(directoryToMove.directory_path)
            )
            .map(async (i) => {
                const childFrom = removeTrailingSlash(i.directory_path).split(
                    '/'
                );
                const childDest = newDirectory.split('/');
                const currentDirectoryName = childFrom[childFrom.length - 1];
                const updatedDirectory = `${childDest
                    .join('/')
                    .concat(currentDirectoryName)}/`;
                i.directory_path = updatedDirectory;
                await this.DirectoryService.findAndUpdate(
                    { _id: i._id },
                    {
                        directory_path:
                            i._id.toString() === directoryToMove._id.toString()
                                ? newDirectory
                                : updatedDirectory,
                    }
                );
                return i;
            });
        files
            .filter((i) => i.file_dir.includes(directoryToMove.directory_path))
            .map(async (i) => {
                const split = i.file_dir.split('/');
                const newFileDir = `${newDirectory}${split}`;
                await this.FileService.findAndUpdate(
                    { _id: i._id },
                    { file_dir: newFileDir }
                );
                return i;
            });
        return filteredDirectories;
    }
}
