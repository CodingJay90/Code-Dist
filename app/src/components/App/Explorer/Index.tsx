import BackdropWithSpinner from "@/components/Loaders/BackdropWithSpinner";
import SuspenseLoader from "@/components/SuspenseLoader/Index";
import { useInteractionContext } from "@/contexts/interactions/InteractionContextProvider";
import { StyledContainer, StyledFlex } from "@/elements/Global";
import { IDirectory } from "@/graphql/models/app.interface";
import { useGetDirectoryTree } from "@/graphql/queries/app.queries";
import { useAppSelector } from "@/reduxStore/hooks";
import { Fragment, useEffect } from "react";
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
  const {
    data,
    loading,
    error,
    refetch,
    getDirectoryTree,
    networkStatusLoading,
  } = useGetDirectoryTree();

  const { explorerInteractions, setExplorerInteractionsState } =
    useInteractionContext();
  const { reRenderFileTree } = explorerInteractions;
  const { directoryTree } = useAppSelector((state) => state.app);

  useEffect(() => {
    const directoryAlreadyLoaded =
      Object.values(directoryTree)[0].length ||
      Object.values(directoryTree)[1].length;
    if (directoryAlreadyLoaded) return; //prevent calling on the query each time view is switched from explorer to something else
    getDirectoryTree();
  }, [directoryTree]);

  useEffect(() => {
    if (reRenderFileTree) {
      console.log("getting");
      getDirectoryTree();
      setExplorerInteractionsState({
        ...explorerInteractions,
        reRenderFileTree: false,
      });
    }
  }, [reRenderFileTree]);

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
    return directoryTree.directories.map((i) => {
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
    <StyledContainer width="100%">
      <SuspenseLoader
        loadingState={networkStatusLoading}
        loadingFallback={<BackdropWithSpinner />}
        error={!!error}
        errorFallback={<h1>error</h1>}
      >
        <Fragment>
          <ExplorerNav />
          <FolderBlockContainer id="trx">
            {renderDirectoryTree()}
          </FolderBlockContainer>
          {directoryTree.root_dir_files.map((i) => (
            <File directoryPath="test" file={i} key={i._id} />
          ))}
        </Fragment>
      </SuspenseLoader>
    </StyledContainer>
  );
};

export default Explorer;
