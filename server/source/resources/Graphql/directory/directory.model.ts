import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';
import {
    IDirectory,
    DirectoryMongooseDocument,
} from '@/graphql/directory/directory.interface';
import fileModel, { FileSchema } from '@/graphql/file/file.model';

const DirectoryTree = new Schema({
    directory_id: {
        type: String,
        default: `directory-${nanoid(10)}`,
    },
    directory_name: {
        type: String,
    },
    directory_path: {
        type: String,
    },
    isDirectory: {
        type: Boolean,
    },
    files: [FileSchema],
    sub_directory: [this],
});

const DirectorySchema = new Schema(
    {
        user_id: {
            type: String,
            default: `user-${nanoid(10)}`,
        },
        directory_id: {
            type: String,
            default: `rootDir-${nanoid(10)}`,
        },
        directories: [DirectoryTree],
    },
    { timestamps: true }
);

// DirectorySchema.add({
//     sub_directory: [DirectorySchema],
// });

const DirectoryModel = model<DirectoryMongooseDocument>(
    'Directory',
    DirectorySchema
);

export default DirectoryModel;
