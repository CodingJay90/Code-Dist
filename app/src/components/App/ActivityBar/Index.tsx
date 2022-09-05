import { StyledContainer, StyledFlex } from "@/elements/Global";
import React from "react";
import { Container, IconWrapper } from "./elements";
import { VscFiles, VscSearch } from "react-icons/vsc";

const SideBar = () => {
  return (
    <Container>
      <StyledFlex direction="column">
        <IconWrapper width="50%">
          <VscFiles size={24} />
        </IconWrapper>
        <IconWrapper width="50%">
          <VscSearch size={24} />
        </IconWrapper>
      </StyledFlex>
    </Container>
  );
};

export default SideBar;
