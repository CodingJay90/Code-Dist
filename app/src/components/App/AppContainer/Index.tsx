import React from "react";
import SideBar from "@/components/App/ActivityBar/Index";
import { Grid, StyledContainer } from "./elements";
import Explorer from "@/components/App/Explorer/Index";
import Editor from "@/components/App/Editor/Index";

const AppContainer = () => {
  return (
    <StyledContainer onContextMenu={(e) => e.preventDefault()}>
      <Grid>
        <SideBar />
        <Explorer />
        <Editor />
      </Grid>
    </StyledContainer>
  );
};

export default AppContainer;
