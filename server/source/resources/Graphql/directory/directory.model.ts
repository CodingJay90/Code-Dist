import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';
import {
    IDirectory,
    DirectoryMongooseDocument,
} from '@/graphql/directory/directory.interface';
import { FileSchema } from '@/graphql/file/file.model';

const DirectorySchema = new Schema({
    directory_id: {
        type: String,
        default: `directory-${nanoid(10)}`,
    },
    directory_name: {
        type: String,
    },
    directory_path: {
        type: String,
        unique: true,
    },
    isDirectory: {
        type: Boolean,
        default: true,
    },
    files: [FileSchema],
    // sub_directory: [this],
});

DirectorySchema.add({
    sub_directory: [DirectorySchema],
});

const DirectoryTreeSchema = new Schema(
    {
        user_id: {
            type: String,
            default: `user-${nanoid(10)}`,
        },
        directory_id: {
            type: String,
            default: `rootDir-${nanoid(10)}`,
        },
        directories: [DirectorySchema],
    },
    { timestamps: true }
);

const DirectoryTreeModel = model<DirectoryMongooseDocument>(
    'DirectoryTree',
    DirectoryTreeSchema
);

const DirectoryModel = model<IDirectory>('Directory', DirectorySchema);

export { DirectoryTreeModel, DirectoryModel };

// export default DirectoryModel;
