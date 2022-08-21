import { IDirectory } from '@/graphql/directory/directory.interface';
import { Field, ObjectType, InputType, InterfaceType, ID } from 'type-graphql';
import { File } from '@/graphql/file/file.schema';

@ObjectType()
class DirectoryUpload {
    @Field()
    filename!: string;

    @Field()
    mimetype!: string;

    @Field()
    encoding!: string;
}

@ObjectType()
class DirectoryType {
    @Field((type) => ID)
    directory_id!: string;

    @Field()
    directory_name!: string;

    @Field()
    directory_path!: string;

    @Field()
    isDirectory!: boolean;
}

@ObjectType()
export class Directory
    extends DirectoryType
    implements Omit<IDirectory, 'sub_directory'>
{
    @Field((type) => [DirectoryType])
    sub_directory!: DirectoryType[];

    @Field((type) => [File])
    files!: File[];
}
