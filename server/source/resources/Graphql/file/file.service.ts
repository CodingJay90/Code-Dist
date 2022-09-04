import { FileEntry, IDirectory } from '@/graphql/directory/directory.interface';
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
  public formatFileStructure(file: FileEntry): IFile {
    return {
      file_name: file.name,
      file_dir: file.entryName,
      file_id: `file-${nanoid(10)}`,
      file_type: file.entryName.split('.').pop() ?? 'txt',
      file_content: file.fileContent ?? '',
      isDirectory: file.isDirectory ?? false,
    };
  }

  public addFilesToDirectory(
    directories: IDirectory[],
    files: IFile[]
  ): { directories: IDirectory[]; rootDirFiles: IFile[] } {
    const temp: IFile[] = [];
    const mapped = directories.map((directory) => {
      files.forEach((file) => {
        const fileSplit = file.file_dir.split('/');
        if (
          `${fileSplit.slice(0, fileSplit.length - 1).join('/')}/` ===
          directory.directory_path
        ) {
          directory.files?.push(file);
        }
        fileSplit.pop();
        if (fileSplit.join('/') === directory.directory_path.split('/')[0]) {
          temp.push(file);
        }
      });

      return directory;
    });
    const uniqueFiles = temp.filter(
      (c: any, index: any) => temp.indexOf(c) === index
    );
    return { directories: mapped, rootDirFiles: uniqueFiles };
  }

  // MONGOOSE SERVICES
  public async getFiles(
    query: FilterQuery<IFile>,
    options: QueryOptions = { lean: true }
  ): Promise<IFile[]> {
    return await FileModel.find(query, {}, options);
  }

  public async getFile(
    query: FilterQuery<IFile>,
    options: QueryOptions = { lean: true }
  ): Promise<IFile | null> {
    return await FileModel.findOne(query, {}, options);
  }

  public async createFile(
    input: DocumentDefinition<
      Pick<IFile, 'file_name' | 'file_dir' | 'file_type'>
    >
  ): Promise<IFile> {
    return await FileModel.create(input);
  }

  public async findAndUpdate(
    query: FilterQuery<IFile>,
    update: UpdateQuery<IFile>,
    options?: QueryOptions
  ): Promise<IFile | null> {
    return await FileModel.findOneAndUpdate(query, update, options);
  }

  public async deleteFile(
    query: FilterQuery<IFile>
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    return await FileModel.deleteOne(query);
  }
}

export default FileService;
