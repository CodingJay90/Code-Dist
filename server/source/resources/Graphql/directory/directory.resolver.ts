/* eslint-disable camelcase */
import { Query, Resolver, Mutation, Arg } from 'type-graphql';
import { baseDirectory } from '@/utils/constants';
import {
  DeleteDirectoryInput,
  Directory,
  DirectoryInput,
  DirectoryTree,
  MoveDirectoryInput,
  RenameDirectoryInput,
} from '@/graphql/directory/directory.schema';
import DirectoryService from '@/graphql/directory/directory.service';
import { DirectoryModel } from '@/graphql/directory/directory.model';
import { FileModel } from '@/graphql/file/file.model';
import FileService from '@/graphql/file/file.service';
// @ts-expect-error
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { removeTrailingSlash, transFormIdToMongooseId } from '@/utils/strings';
import { IDirectory } from '@/graphql/directory/directory.interface';
import { IFile } from '@/graphql/file/file.interface';
// import { IFile } from '../file/file.interface';

@Resolver(() => Directory)
export class DirectoryResolver {
  private readonly DirectoryService = new DirectoryService();
  private readonly FileService = new FileService();

  @Query(() => DirectoryTree)
  async getDirectoryTree(): Promise<{
    directories: IDirectory[];
    root_dir_files: IFile[];
  }> {
    const directories = await this.DirectoryService.getDirectories({});
    const files = await this.FileService.getFiles({});
    const mergedFilesAndFolders = this.FileService.addFilesToDirectory(
      directories,
      files
    );
    const extractedDirectories =
      await this.DirectoryService.listDirectoriesInExtractedZip(
        mergedFilesAndFolders.directories
      );
    const newArray = extractedDirectories.map((m) => [m.directory_path, m]);
    const newMap = new Map(newArray as any);
    const iterator = newMap.values();
    const unique = [...(iterator as any)]; // this will only work when using es2015 or higher (set ""downlevelIteration": true" in tsconfig.json to use when target is lower than 3s2015)
    return {
      directories: unique,
      root_dir_files: mergedFilesAndFolders.rootDirFiles,
    };
  }

  @Mutation(() => Boolean)
  async uploadZip(
    @Arg('file', () => GraphQLUpload)
    file: FileUpload
  ): Promise<boolean> {
    const { createReadStream, filename, mimetype } = await file;
    const pathToDir = `${baseDirectory}/${filename}`;
    if (mimetype !== 'application/zip') {
      return await Promise.reject(
        new Error('Uploaded folder/file must be in a zip format')
      );
    }
    return await new Promise((resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(pathToDir))
        .on('finish', async () => {
          // Read the uploaded zip file and save the returned json to db
          const data = await this.DirectoryService.readZip(pathToDir);
          const directories = data.filter((i) => i.isDirectory);
          const files = data.filter((i) => !i.isDirectory);
          try {
            await DirectoryModel.deleteMany({});
            await FileModel.deleteMany({});
            await DirectoryModel.create(
              directories.map((i) =>
                this.DirectoryService.formatDirectoryStructure(i)
              )
            );
            await FileModel.create(
              files.map((i) => this.FileService.formatFileStructure(i))
            );

            resolve(true);
          } catch (error) {
            reject(error);
          }
        })
        .on('close', () => resolve(true))
        .on('error', (err) => reject(err));
    });
  }

  @Mutation(() => Directory)
  async createDirectory(
    @Arg('input') input: DirectoryInput
  ): Promise<IDirectory> {
    let { directory_name, directory_path } = input;
    directory_name = removeTrailingSlash(directory_name);
    try {
      const newDirectory = await this.DirectoryService.createDirectory({
        directory_name,
        directory_path: `${directory_path}${directory_name}/`,
      });
      return newDirectory;
    } catch (error) {
      return (error as any).message;
    }
  }

  @Mutation(() => String)
  async renameDirectory(
    @Arg('input') input: RenameDirectoryInput
  ): Promise<string> {
    let { directory_name, _id } = input;
    directory_name = removeTrailingSlash(directory_name);
    const id = transFormIdToMongooseId(_id);
    const query = {
      $or: [{ directory_id: _id }, { _id: id }], // query by directory_id or _id
    };
    const directory = await this.DirectoryService.getDirectory(query);
    if (directory == null) {
      return await Promise.reject(
        new Error('Directory with the given id not found')
      );
    }
    const splits = removeTrailingSlash(directory.directory_path).split('/');
    // splits.pop();
    splits[splits.length - 1] = directory_name;
    const newDirectoryPath = `${splits.join('/')}/`;
    const directories = await this.DirectoryService.getDirectories({});
    // update sub_directory paths
    directories
      .filter((i) => i.directory_path.includes(directory.directory_path))
      .map(async (i) => {
        const dirPathSplits = i.directory_path.split('/');
        const newChildDirPath = dirPathSplits
          .slice(splits.length, dirPathSplits.length)
          .join('/');
        await this.DirectoryService.findAndUpdate(
          { _id: i._id },
          {
            directory_path: `${newDirectoryPath}${newChildDirPath ?? ''}`,
          }
        );
        return i;
      });

    const updatedDirectory = await this.DirectoryService.findAndUpdate(query, {
      directory_path: newDirectoryPath,
      directory_name,
    });
    return updatedDirectory?.directory_path ?? '';
  }

  @Mutation(() => Boolean)
  async deleteDirectory(
    @Arg('input') input: DeleteDirectoryInput
  ): Promise<boolean> {
    const id = transFormIdToMongooseId(input._id);
    const query = {
      $or: [{ directory_id: input._id }, { _id: id }], // query by directory_id or _id
    };
    const directory = await this.DirectoryService.getDirectory(query);
    if (directory == null) {
      return await Promise.reject(
        new Error('Directory with the given id not found')
      );
    }
    const split = removeTrailingSlash(directory.directory_path).split('/');
    const directories = await this.DirectoryService.getDirectories({});
    directories.map(async (i) => {
      if (
        removeTrailingSlash(i.directory_path)
          .split('/')
          .slice(0, split.length)
          .join('/') === split.join('/')
      ) {
        await this.DirectoryService.deleteDirectory({ _id: i._id });
      }
    });
    await this.DirectoryService.deleteDirectory(query);
    return true;
  }

  @Mutation(() => [Directory])
  async moveDirectory(@Arg('input') input: MoveDirectoryInput): Promise<any> {
    let { destination_path, from_id } = input;
    destination_path = removeTrailingSlash(destination_path);
    const id = transFormIdToMongooseId(from_id);
    const query = {
      $or: [{ directory_id: id }, { _id: id }], // query by directory_id or _id
    };
    const directoryToMove = await this.DirectoryService.getDirectory(query); // get the directory to move
    const directories = await this.DirectoryService.getDirectories({});
    const files = await this.FileService.getFiles({});
    if (directoryToMove == null) {
      return await Promise.reject(
        new Error('Directory with the given id not found')
      );
    }
    const from = removeTrailingSlash(directoryToMove.directory_path).split('/');
    const dest = destination_path.split('/');
    const currentDirectoryName = from[from.length - 1];
    const newDirectory = `${`${dest.join('/')}/`.concat(
      currentDirectoryName
    )}/`; // /newly/updated/path/
    // if (!directories.length) return Promise.resolve([]);?

    const filteredDirectories = directories
      .filter((i) => i.directory_path.includes(directoryToMove.directory_path))
      .map(async (i) => {
        const childFrom = removeTrailingSlash(i.directory_path).split('/');
        const childDest = newDirectory.split('/');
        const currentDirectoryName = childFrom[childFrom.length - 1];
        const updatedDirectory = `${childDest
          .join('/')
          .concat(currentDirectoryName)}/`;
        i.directory_path = updatedDirectory;
        if (i._id == null || directoryToMove._id == null) return;
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
        const split = i.file_dir.split('/').pop();
        const newFileDir = `${newDirectory}${split ?? ''}`;
        await this.FileService.findAndUpdate(
          { _id: i._id },
          { file_dir: newFileDir }
        );
        return i;
      });
    return filteredDirectories;
  }
}
