import { useState } from "react";
import ActivityBar from "@/components/App/ActivityBar/Index";
import { Grid, Container } from "./elements";
import Explorer from "@/components/App/Explorer/Index";
import Editor from "@/components/App/Editor/Index";
import { ExplorerView } from "@/components/models";
import FilesSearch from "@/components/App/FilesSearch/Index";
import { ViewContainer } from "./elements";

const AppContainer = () => {
  const [view, setView] = useState<ExplorerView>(ExplorerView.EXPLORER);

  function renderExplorerView(): JSX.Element {
    switch (view) {
      case ExplorerView.EXPLORER:
        return <Explorer />;
      case ExplorerView.SEARCH:
        return <FilesSearch />;
      default:
        return <Explorer />;
    }
  }
  return (
    <Container onContextMenu={(e) => e.preventDefault()}>
      <Grid>
        <ActivityBar setExplorerView={setView} explorerView={view} />
        <ViewContainer>{renderExplorerView()}</ViewContainer>
        <Editor />
      </Grid>
    </Container>
  );
};

export default AppContainer;
