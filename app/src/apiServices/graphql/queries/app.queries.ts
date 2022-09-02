import { gql, useQuery } from "@apollo/client";
// import { IDirectory } from "../models/app.interface";
import { IDirectory } from "@/graphql/models/app.interface";
import { DIRECTORY_TREE_FRAGMENT } from "./fragments";

// TBD: move this to a rest Api in order to get around the infinite recursion prevented by Graphql
const GET_DIRECTORY_TREE = gql`
  ${DIRECTORY_TREE_FRAGMENT}
  query GetDirectoryTree {
    getDirectoryTree {
      _id
      directory_id
      directory_name
      directory_path
      isDirectory
      sub_directory {
        ...DirectoryTreeFragment
        sub_directory {
          ...DirectoryTreeFragment
          sub_directory {
            ...DirectoryTreeFragment
            sub_directory {
              ...DirectoryTreeFragment
              sub_directory {
                ...DirectoryTreeFragment
                sub_directory {
                  ...DirectoryTreeFragment
                  sub_directory {
                    ...DirectoryTreeFragment
                    sub_directory {
                      ...DirectoryTreeFragment
                      sub_directory {
                        ...DirectoryTreeFragment
                        sub_directory {
                          ...DirectoryTreeFragment
                          sub_directory {
                            ...DirectoryTreeFragment
                            sub_directory {
                              ...DirectoryTreeFragment
                              sub_directory {
                                ...DirectoryTreeFragment
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      files {
        _id
        file_id
        file_type
        file_name
        file_dir
        file_content
      }
    }
  }
`;

export const useGetDirectoryTree = () => {
  const { data, loading, error, refetch } = useQuery<{
    getDirectoryTree: IDirectory[];
  }>(GET_DIRECTORY_TREE);

  return { data, loading, error, refetch };
};
