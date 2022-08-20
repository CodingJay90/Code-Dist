import { IDirectory } from '@/resources/directory/directory.interface';
import { IFile } from '@/resources/file/file.interface';
import { Field, ObjectType, InputType, InterfaceType, ID } from 'type-graphql';

@ObjectType()
class IDirectoryGraphQL {
    @Field()
    directory_id!: string;

    @Field()
    directory_name!: string;

    @Field()
    directory_path!: string;

    @Field()
    isDirectory!: boolean;
}

@ObjectType()
export class Directory extends IDirectoryGraphQL {
    @Field()
    directory_iud!: string;

    @Field((type) => [IDirectoryGraphQL])
    sub_directory!: IDirectoryGraphQL[];
}
// @Field()
// sub_directory!: IDirectory[];

// @InputType()
// export class UserInput
//     implements Pick<Directory, 'directory_name' | 'directory_path'>
// {
//     @Field()
//     directory_name!: string;

//     @Field()
//     directory_path!: string;
// }
