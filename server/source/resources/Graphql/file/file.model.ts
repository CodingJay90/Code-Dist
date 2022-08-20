import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';
import { FileMongooseDocument } from '@/resources/file/file.interface';

export const FileSchema = new Schema(
    {
        file_type: {
            type: String,
            // required: true,
        },
        file_name: {
            type: String,
            // required: true,
        },
        file_dir: {
            type: String,
            // required: true,
        },
        file_content: {
            type: String,
            // required: true,
        },
        file_id: {
            type: String,
            // required: true,
        },
    },
    { timestamps: true }
);

export default model<FileMongooseDocument>('File', FileSchema);
