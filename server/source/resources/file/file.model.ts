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

// FileSchema.pre<FileMongooseDocument>('save', async function (next) {
//     if (!this.isModified('file_id')) {
//         return next();
//     }

//     this.file_id = `file-${nanoid(10)}`;

//     next();
// });

export default model<FileMongooseDocument>('File', FileSchema);
