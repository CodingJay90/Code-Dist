import { gql, useMutation } from "@apollo/client";
import { IDirectory } from "@/graphql/models/app.interface";
import { GET_DIRECTORY_TREE } from "@/graphql/queries/app.queries";

const CREATE_DIRECTORY = gql`
  mutation CreateDirectory($input: DirectoryInput!) {
    createDirectory(input: $input) {
      _id
      directory_id
      directory_name
      directory_path
      isDirectory
      sub_directory {
        _id
      }
      files {
        _id
      }
    }
  }
`;

export const useCreateDirectory = (args: {
  directoryName: string;
  directoryPath: string;
}) => {
  const [createDirectory, { error, data }] = useMutation<
    { createDirectory: IDirectory },
    { input: Pick<IDirectory, "directory_name" | "directory_path"> }
  >(CREATE_DIRECTORY, {
    variables: {
      input: {
        directory_name: args.directoryName,
        directory_path: args.directoryPath,
      },
    },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: GET_DIRECTORY_TREE,
      }) as { getDirectoryTree: IDirectory[] };
      let createdDirectoryData = [...data.getDirectoryTree];
      createdDirectoryData = [
        result.data?.createDirectory as IDirectory,
        ...createdDirectoryData,
      ];
      proxy.writeQuery({
        query: GET_DIRECTORY_TREE,
        data: {
          ...data,
          getDirectoryTree: {
            createdDirectoryData,
          },
        },
      });
    },
  });

  return { createDirectory, data, error };
};
