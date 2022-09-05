import { gql, NetworkStatus, useLazyQuery, useQuery } from "@apollo/client";
// import { IDirectory } from "../models/app.interface";
import { IDirectory, IFile } from "@/graphql/models/app.interface";
import { DIRECTORY_TREE_FRAGMENT } from "./fragments";

// TBD: move this to a rest Api in order to get around the infinite recursion prevented by Graphql
export const GET_DIRECTORY_TREE = gql`
  ${DIRECTORY_TREE_FRAGMENT}
  query GetDirectoryTree {
    getDirectoryTree {
      root_dir_files {
        _id
        file_id
        file_type
        file_name
        file_dir
        file_content
      }
      directories {
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
  }
`;

export const useGetDirectoryTree = () => {
  const [getDirectoryTree, { data, loading, error, refetch, networkStatus }] =
    useLazyQuery<{
      getDirectoryTree: { directories: IDirectory[]; root_dir_files: IFile[] };
    }>(GET_DIRECTORY_TREE, {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
    });
  const networkStatusLoading = networkStatus !== NetworkStatus.ready; //refetch wouldn't update loading state
  return {
    data,
    loading,
    error,
    refetch,
    getDirectoryTree,
    networkStatusLoading,
  };
};
