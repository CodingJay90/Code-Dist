import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';
import { FileMongooseDocument } from '@/graphql/file/file.interface';

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
      // unique: true,
      // required: true,
    },
    file_content: {
      type: String,
      default: '',
      // required: true,
    },
    file_id: {
      type: String,
      default: `file-${nanoid(10)}`,
    },
    is_directory: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const FileModel = model<FileMongooseDocument>('File', FileSchema);

export { FileModel, FileSchema };
