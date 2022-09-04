import BackdropWithSpinner from "@/components/Loaders/BackdropWithSpinner";
import SuspenseLoader from "@/components/SuspenseLoader/Index";
import { StyledFlex } from "@/elements/Global";
import { IDirectory } from "@/graphql/models/app.interface";
import { useGetDirectoryTree } from "@/graphql/queries/app.queries";
import { Fragment, useCallback } from "react";
import {
  Container,
  FolderArrowIcon,
  FolderBlock,
  FolderBlockContainer,
  FolderIcon,
  FolderName,
} from "./elements";
import ExplorerNav from "./explorerNav/Index";
import File from "./File";
import Folder from "./Folder";

const Explorer = () => {
  const { data, loading, error, refetch } = useGetDirectoryTree();

  function displaySubDirectory(dir: IDirectory[]) {
    const elements = dir.map((i) => {
      return (
        <Folder folder={i} nested={true} key={i._id}>
          <>
            {i.sub_directory.length
              ? displaySubDirectory(i.sub_directory)
              : null}
            {i.files.map((file) => (
              <File
                directoryPath={i.directory_path}
                file={file}
                key={file._id}
              />
            ))}
          </>
        </Folder>
      );
    });
    return elements;
  }

  const renderDirectoryTree = () => {
    return data?.getDirectoryTree.directories.map((i) => {
      return (
        <Folder folder={i} nested={false} key={i._id}>
          <>
            {displaySubDirectory(i.sub_directory)}
            {i.files.map((file) => (
              <File
                directoryPath={i.directory_path}
                file={file}
                key={file._id}
              />
            ))}
          </>
        </Folder>
      );
    });
  };
  return (
    <Container>
      <SuspenseLoader
        loadingState={loading}
        loadingFallback={<BackdropWithSpinner />}
        error={!!error}
        errorFallback={<h1>error</h1>}
      >
        <Fragment>
          <ExplorerNav />
          <FolderBlockContainer>{renderDirectoryTree()}</FolderBlockContainer>
          {data?.getDirectoryTree.root_dir_files.map((i) => (
            <File directoryPath="test" file={i} key={i._id} />
          ))}
        </Fragment>
      </SuspenseLoader>
    </Container>
  );
};

export default Explorer;
