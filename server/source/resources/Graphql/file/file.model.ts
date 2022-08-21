import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';
import { FileMongooseDocument } from '@/resources/file/file.interface';

const FileSchema = new Schema(
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

const FileModel = model<FileMongooseDocument>('File', FileSchema);

export { FileModel, FileSchema };
