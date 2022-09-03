import BackdropWithSpinner from "@/components/Loaders/BackdropWithSpinner";
import SuspenseLoader from "@/components/SuspenseLoader/Index";
import { StyledFlex } from "@/elements/Global";
import { IDirectory } from "@/graphql/models/app.interface";
import { useGetDirectoryTree } from "@/graphql/queries/app.queries";
import { useCallback } from "react";
import {
  Container,
  FolderArrowIcon,
  FolderBlock,
  FolderIcon,
  FolderName,
} from "./elements";
import File from "./File";
import Folder from "./Folder";

const Explorer = () => {
  const { data, loading, error } = useGetDirectoryTree();

  function displaySubDirectory(dir: IDirectory[]) {
    const elements = dir.map((i) => {
      return (
        <Folder folder={i} nested={true}>
          <>
            {i.sub_directory.length
              ? displaySubDirectory(i.sub_directory)
              : null}
            {i.files.map((file) => (
              <File file={file} />
            ))}
          </>
        </Folder>
      );
    });
    return elements;
  }

  const renderDirectoryTree = () => {
    return data?.getDirectoryTree.map((i) => {
      return (
        <Folder folder={i} nested={false}>
          <>
            {displaySubDirectory(i.sub_directory)}
            {i.files.map((i) => (
              <File file={i} />
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
        <>{renderDirectoryTree()}</>
      </SuspenseLoader>
    </Container>
  );
};

export default Explorer;
