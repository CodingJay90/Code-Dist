import { Query, Resolver, Mutation, Arg } from 'type-graphql';
import DirectoryService from '@/graphql/directory/directory.service';
import FileService from '@/graphql/file/file.service';
import { removeTrailingSlash, transFormIdToMongooseId } from '@/utils/strings';
import {
  CreateFileInput,
  DeleteFileInput,
  File,
  GetFileInput,
  MoveFileInput,
  RenameFileInput,
  UpdateFileContentInput,
} from '@/graphql/file/file.schema';
import { IFile } from '@/graphql/file/file.interface';

@Resolver(() => File)
export class FileResolver {
  private readonly DirectoryService = new DirectoryService();
  private readonly FileService = new FileService();

  @Query(() => File)
  async getFile(@Arg('input') input: GetFileInput): Promise<IFile> {
    const id = transFormIdToMongooseId(input.id);
    const query = {
      $or: [{ directory_id: input.id }, { _id: id }], // query by directory_id or _id
    };
    const file = await this.FileService.getFile(query);
    if (file == null) return await Promise.reject(new Error('File not found'));
    return file;
  }

  @Mutation(() => String)
  async createFile(@Arg('input') input: CreateFileInput): Promise<string> {
    const { file_name, file_dir } = input;
    // const directoryToAddFile = await this.DirectoryService.getDirectory({
    //   directory_path: file_dir,
    // });
    const formattedDir = removeTrailingSlash(file_dir);
    // if (directoryToAddFile == null) {
    //   return await Promise.reject(new Error("Directory doesn't exist"));
    // }
    const fileExtension =
      file_name.split('.').length > 1 ? file_name.split('.').pop() : '';
    const createdFile = await this.FileService.createFile({
      file_dir: `${formattedDir}/${file_name}`,
      file_name,
      file_type: fileExtension ?? '',
    });
    return createdFile._id ?? '';
  }

  @Mutation(() => String)
  async renameFile(@Arg('input') input: RenameFileInput): Promise<string> {
    const { file_name, file_id } = input;
    const id = transFormIdToMongooseId(file_id);
    const query = {
      $or: [{ file_id }, { _id: id }], // query by directory_id or _id
    };
    const file = await this.FileService.getFile(query);
    if (file == null) return await Promise.reject(new Error('File not found'));
    const newFileDir = removeTrailingSlash(file.file_dir).split('/');
    newFileDir.pop();
    const fileExtension =
      file_name.split('.').length > 1 ? file_name.split('.').pop() : '';
    await this.FileService.findAndUpdate(query, {
      file_name,
      file_type: fileExtension,
      file_dir: `${newFileDir.join('/')}/${file_name}`,
    });
    return file._id ?? '';
  }

  @Mutation(() => String)
  async updateFileContent(
    @Arg('input') input: UpdateFileContentInput
  ): Promise<string> {
    const { _id, file_content } = input;
    const file = await this.FileService.getFile({ _id });
    if (file == null) return await Promise.reject(new Error('File not found'));
    await this.FileService.findAndUpdate(
      { _id },
      {
        file_content,
      }
    );
    return file._id ?? '';
  }

  @Mutation(() => Boolean)
  async deleteFile(@Arg('input') input: DeleteFileInput): Promise<boolean> {
    const id = transFormIdToMongooseId(input.file_id);
    const query = {
      $or: [{ file_id: input.file_id }, { _id: id }], // query by directory_id or _id
    };
    const file = await this.FileService.getFile(query);
    if (file == null) return await Promise.reject(new Error('File not found'));
    await this.FileService.deleteFile(query);
    return true;
  }

  @Mutation(() => Boolean)
  async moveFile(@Arg('input') input: MoveFileInput): Promise<boolean> {
    try {
      const { destination_path, file_id } = input;
      const id = transFormIdToMongooseId(file_id);
      const query = {
        $or: [{ file_id }, { _id: id }], // query by directory_id or _id
      };
      const file = await this.FileService.getFile(query);
      if (file == null) {
        return await Promise.reject(new Error('File not found'));
      }
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
