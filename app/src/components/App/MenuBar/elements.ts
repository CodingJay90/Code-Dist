import { StyledFlex } from "@/elements/Global";
import styled from "styled-components";

export const MenuBarContainer = styled.div`
  height: 4vh;
  border-bottom: 1px solid grey;
`;
export const MenuBarGroup = styled(StyledFlex)`
  height: 100%;
`;
export const MenuBarButtonContainer = styled.div`
  margin-left: 60px;
`;
export const MenuBarButton = styled.button`
  text-transform: capitalize;
  display: inline-block;
  margin-right: 16px;
  border: none;
  background: transparent;
  cursor: pointer;
`;
export const UploadInput = styled.input`
  visibility: hidden;
`;
