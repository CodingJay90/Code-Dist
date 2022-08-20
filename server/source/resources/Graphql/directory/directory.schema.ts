import { IDirectory } from '@/resources/directory/directory.interface';
import { IFile } from '@/resources/file/file.interface';
import { Field, ObjectType, InputType } from 'type-graphql';

@ObjectType()
export class Directory implements IDirectory {
    @Field()
    directory_id!: string;

    @Field()
    directory_name!: string;

    @Field()
    directory_path!: string;

    @Field()
    isDirectory!: boolean;

    @Field()
    sub_directory!: IDirectory[];

    @Field()
    files!: IFile[];
}

@InputType()
export class UserInput
    implements Pick<Directory, 'directory_name' | 'directory_path'>
{
    @Field()
    directory_name!: string;

    @Field()
    directory_path!: string;
}
