import { IFile } from '@/graphql/file/file.interface';
import { Field, ObjectType, InputType, ID } from 'type-graphql';

@ObjectType()
export class File implements IFile {
  @Field((type) => ID)
  _id!: string;

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

@InputType()
export class GetFileInput {
  @Field()
  id!: string;
}

@InputType()
export class CreateFileInput {
  @Field()
  file_name!: string;

  @Field()
  file_dir!: string;
}
@InputType()
export class RenameFileInput {
  @Field()
  file_name!: string;

  @Field()
  file_id!: string;
}
@InputType()
export class DeleteFileInput {
  @Field()
  file_id!: string;
}
@InputType()
export class MoveFileInput {
  @Field()
  file_id!: string;

  @Field()
  destination_path!: string;
}
