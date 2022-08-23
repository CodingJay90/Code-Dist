import {
    IDirectory,
    DirectoryMongooseDocument,
} from '@/graphql/directory/directory.interface';
import { Field, ObjectType, InputType, InterfaceType, ID } from 'type-graphql';
import { File } from '@/graphql/file/file.schema';

@ObjectType()
export class DirectoryType implements Omit<IDirectory, 'sub_directory'> {
    @Field((type) => ID)
    _id!: string;

    @Field((type) => ID)
    directory_id!: string;

    @Field()
    directory_name!: string;

    @Field()
    directory_path!: string;

    @Field()
    isDirectory!: boolean;

    @Field((type) => [File])
    files!: File[];
}

@ObjectType()
export class Directory implements IDirectory {
    @Field((type) => ID)
    _id!: string;

    @Field((type) => ID)
    directory_id!: string;

    @Field()
    directory_name!: string;

    @Field()
    directory_path!: string;

    @Field()
    isDirectory!: boolean;

    @Field((type) => [Directory])
    sub_directory!: [Directory];

    @Field((type) => [File])
    files!: File[];
}

// @ObjectType()
// export class Directory
//     implements Pick<DirectoryMongooseDocument, 'user_id' | 'directory_id'>
// {
//     @Field()
//     user_id!: string;

//     @Field()
//     directory_id!: string;

//     @Field((type) => [DirectoryType])
//     directories!: DirectoryType[];
// }
// @ObjectType()
// export class Directory
//     extends DirectoryType
//     implements Omit<IDirectory, 'sub_directory'>
// {
// @Field((type) => [DirectoryType])
// sub_directory!: DirectoryType[];

// @Field((type) => [File])
// files!: File[];
// }

@InputType()
export class DirectoryInput
    implements Pick<Directory, 'directory_name' | 'directory_path'>
{
    @Field()
    directory_name!: string;

    @Field()
    directory_path!: string;
}
@InputType()
export class RenameDirectoryInput
    implements Pick<Directory, 'directory_name' | '_id'>
{
    @Field()
    directory_name!: string;

    @Field()
    _id!: string;
}
@InputType()
export class DeleteDirectoryInput implements Pick<Directory, '_id'> {
    @Field()
    _id!: string;
}
