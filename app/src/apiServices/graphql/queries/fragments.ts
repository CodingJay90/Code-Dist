import { gql } from "@apollo/client";

// export const DIRECTORY_TREE_FRAGMENT2 = gql`
//   ${DIRECTORY_TREE_FRAGMENT}
//   fragment DirectoryTreeFragment on Directory {
//     sub_directory {

//     }
//   }
// `;

export const DIRECTORY_TREE_FRAGMENT = gql`
  fragment DirectoryTreeFragment on Directory {
    _id
    directory_id
    directory_name
    directory_path
    isDirectory
    files {
      _id
      file_id
      file_type
      file_name
      file_dir
      file_content
    }
  }
`;
