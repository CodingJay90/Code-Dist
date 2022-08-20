import { Document } from 'mongoose';
export interface IFile {
    file_type: string;
    file_name: string;
    file_dir: string;
    file_content: string;
    file_id: string;
    isDirectory: boolean;
}

export interface FileMongooseDocument extends IFile, Document {}
