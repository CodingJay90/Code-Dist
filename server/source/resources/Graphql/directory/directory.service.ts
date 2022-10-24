import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { nanoid } from 'nanoid';
import AdmZip from 'adm-zip';
import {
  FileEntry,
  IDirectory,
  ZipEntry,
} from '@/graphql/directory/directory.interface';
import { DirectoryModel } from '@/graphql/directory/directory.model';
import { removeTrailingSlash } from '@/utils/strings';

class DirectoryService {
  // Read all contents in a zip file
  public async readZip(pathToDir: string): Promise<FileEntry[]> {
    const zip = new AdmZip(pathToDir);
    const zipEntries = zip.getEntries();
    return zipEntries.map((i: ZipEntry) => {
      if (!i.isDirectory) i.fileContent = i.getData().toString();
      return {
        entryName: i.entryName,
        name: i.name,
        isDirectory: i.isDirectory,
        fileContent: i.fileContent,
        sub_directory: [],
        files: [],
      };
    });
    // return main();
  }

  public formatDirectoryStructure(directory: FileEntry): IDirectory {
    return {
      directory_name:
        directory.entryName.split('/')[
          directory.entryName.split('/').length - 2
        ],
      directory_path: directory.entryName,
      sub_directory: directory.sub_directory ?? [],
      directory_id: `directory-${nanoid(10)}`,
      isDirectory: directory.isDirectory,
      files: directory.files ?? [],
    };
  }

  public async listDirectoriesInExtractedZip(
    fileEntries: IDirectory[]
  ): Promise<IDirectory[]> {
    const listDirectories = fileEntries
      .filter((i) => i.isDirectory)
      .sort((a, b) =>
        a.directory_name > b.directory_name
          ? 1
          : b.directory_name > a.directory_name
          ? -1
          : 0
      );
    const addedChildDirectory: string[] = [];
    const sorted = listDirectories.map((dir, index, dirs) => {
      let indexCount = 0;
      while (indexCount < dirs.length) {
        const nextElement = dirs[indexCount];
        // split the path(entryName string) into array in order to compare
        const directoryPath = removeTrailingSlash(dir.directory_path);
        const nextElementPath = removeTrailingSlash(nextElement.directory_path);
        const currentDirComparison = directoryPath.split('/');
        const nextDirComparison = nextElementPath.split('/');
        /*
                    compare both arrays
                    e.g: currentDirComparison =  [ 'testZip', 'client', 'public']
                    e.g: nextDirComparison =  [ 'testZip', 'client', 'public', 'nestedInPublic']

                    TODO:
                    1)takeout the last item on currentDirComparison (since paths are relative to each other)
                    2)then compare both arrays, if match add to the current iteration(Directory)
                */
        if (
          JSON.stringify(
            currentDirComparison.splice(0, currentDirComparison.length)
          ) ===
          JSON.stringify(
            nextDirComparison.splice(0, nextDirComparison.length - 1)
          )
        ) {
          dir.sub_directory?.push(nextElement);
          addedChildDirectory.push(nextElement.directory_path);
        }
        indexCount++;
      }
      return dir;
    });
    return sorted
      .filter((i) => !addedChildDirectory.includes(i.directory_path))
      .map((i) => i);
  }

  // MONGOOSE SERVICES
  public async getDirectories(
    query: FilterQuery<IDirectory>,
    options: QueryOptions = { lean: true }
  ): Promise<IDirectory[]> {
    return await DirectoryModel.find(query, {}, options);
  }

  public async getDirectory(
    query: FilterQuery<IDirectory>,
    options: QueryOptions = { lean: true }
  ): Promise<IDirectory | null> {
    return await DirectoryModel.findOne(query, {}, options);
  }

  public async createDirectory(
    input: DocumentDefinition<
      Pick<IDirectory, 'directory_name' | 'directory_path'>
    >
  ): Promise<IDirectory> {
    return await DirectoryModel.create(input);
  }

  public async findAndUpdate(
    query: FilterQuery<IDirectory>,
    update: UpdateQuery<IDirectory>,
    options?: QueryOptions
  ): Promise<IDirectory | null> {
    return await DirectoryModel.findOneAndUpdate(query, update, options);
  }

  public async deleteDirectory(
    query: FilterQuery<IDirectory>
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const t = await DirectoryModel.deleteOne(query);
    return t;
  }
}

export default DirectoryService;
