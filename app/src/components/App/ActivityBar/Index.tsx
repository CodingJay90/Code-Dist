import { StyledContainer, StyledFlex } from "@/elements/Global";
import React from "react";
import { Container, IconWrapper } from "./elements";
import { ImFilesEmpty, ImSearch } from "react-icons/im";

const SideBar = () => {
  return (
    <Container>
      <StyledFlex direction="column">
        <IconWrapper width="50%">
          <ImFilesEmpty size={24} />
        </IconWrapper>
        <IconWrapper width="50%">
          <ImSearch size={24} />
        </IconWrapper>
      </StyledFlex>
    </Container>
  );
};

export default SideBar;
