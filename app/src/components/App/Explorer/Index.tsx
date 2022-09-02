import BackdropWithSpinner from "@/components/Loaders/BackdropWithSpinner";
import SuspenseLoader from "@/components/SuspenseLoader/Index";
import { StyledFlex } from "@/elements/Global";
import { useGetDirectoryTree } from "@/graphql/queries/app.queries";
import { useCallback } from "react";
import { Container, FolderBlock } from "./elements";

const Explorer = () => {
  const { data, loading, error } = useGetDirectoryTree();

  function a(n: string) {
    return <div style={{ marginLeft: "16px" }}>{n}</div>;
  }

  function displaySubDirectory(dir: any) {
    const elements = dir.map((i: any) => {
      return (
        <div style={{ marginLeft: "16px" }}>
          <p>{i.directory_name}</p>
          {i.sub_directory.length ? displaySubDirectory(i.sub_directory) : null}
        </div>
      );
    });
    return elements;
  }

  const displayData = () => {
    return data?.getDirectoryTree.map((i) => {
      // console.log(i.sub_directory);
      return (
        <FolderBlock key={i.directory_id}>
          <>
            <StyledFlex justify="flex-start">
              <p>ar</p>
              <p>ic</p>
              <p>{i.directory_name}</p>
            </StyledFlex>
            {displaySubDirectory(i.sub_directory)}
          </>
        </FolderBlock>
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
        <>{displayData()}</>
      </SuspenseLoader>
    </Container>
  );
};

export default Explorer;
