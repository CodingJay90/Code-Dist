// import Arrow from "@/components/Icons/Arrow";
// import Folder from "@/components/Icons/FolderIcon";
import { StyledFlex } from "@/elements/Global";
import styled from "styled-components";

export const Wrapper = styled.div<{ y: number; x: number }>`
  position: absolute;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  z-index: 10;
  background: grey;
  min-width: 10rem;
`;
export const ContextList = styled.ul`
  list-style: none;
  padding-bottom: 0;
  padding-top: 1rem;
`;
export const ContextListItem = styled.li`
  color: #fff;
  padding-bottom: 0.5rem;
  margin-bottom: 0.8rem;
  font-size: 0.8rem;
  padding-left: 1rem;
  cursor: pointer;
  &:hover {
    background-color: $info;
  }
`;
