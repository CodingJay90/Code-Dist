import { IDirectory } from '@/graphql/directory/directory.interface';
import { Field, ObjectType, InputType, ID } from 'type-graphql';
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

@InputType()
export class MoveDirectoryInput {
  @Field()
  from_id!: string;

  @Field()
  destination_path!: string;
}
