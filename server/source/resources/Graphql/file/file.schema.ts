import { IFile } from '@/graphql/file/file.interface';
import { Field, ObjectType, InputType, InterfaceType, ID } from 'type-graphql';

@ObjectType()
export class File implements IFile {
    @Field((type) => ID)
    file_id!: string;

    @Field()
    file_type!: string;

    @Field()
    file_name!: string;

    @Field()
    file_dir!: string;

    @Field()
    file_content!: string;

    @Field()
    isDirectory!: boolean;
}
