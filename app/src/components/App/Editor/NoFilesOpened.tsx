import { StyledContainer, StyledFlex } from "@/elements/Global";
import React from "react";
import { Heading } from "./elements";

const NoFilesOpened = () => {
  return (
    <div>
      <StyledContainer width="50%">
        <StyledFlex direction="column" justify="center" height="80vh">
          <Heading>No File Opened</Heading>
        </StyledFlex>
      </StyledContainer>
    </div>
  );
};

export default NoFilesOpened;
