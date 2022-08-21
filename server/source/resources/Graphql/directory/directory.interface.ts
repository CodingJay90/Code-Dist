import { Document } from 'mongoose';
import { IZipEntry } from 'adm-zip';
import { IFile } from '@/resources/file/file.interface';
export interface IDirectory {
    directory_name: string;
    directory_path: string;
    directory_id: string;
    isDirectory: boolean;
    sub_directory: Array<IDirectory>;
    files: IFile[];
}

export interface ZipEntry extends IZipEntry {
    fileContent?: string;
    sub_directory?: Array<IDirectory>;
    files?: IFile[];
}

export interface DirectoryMongooseDocument extends Document {
    user_id: string;
    directory_id?: string;
    directories: IDirectory[];
}

export type FileEntry = Pick<
    ZipEntry,
    | 'entryName'
    | 'name'
    | 'isDirectory'
    | 'fileContent'
    | 'sub_directory'
    | 'files'
>;
