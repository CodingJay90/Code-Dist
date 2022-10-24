// import Arrow from "@/components/Icons/Arrow";
// import Folder from "@/components/Icons/FolderIcon";
import { StyledFlex } from "@/elements/Global";
import styled from "styled-components";

export const Wrapper = styled.div<{ y: number; x: number }>`
  position: absolute;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  z-index: 10;
  background: ${({ theme }) => theme.colors.white};
  min-width: 210px;
  border-radius: 1px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;
export const ContextList = styled.ul`
  list-style: none;
  padding-bottom: 0;
  padding-top: 0.7rem;
`;
export const ContextListItemWrapper = styled.li`
  padding: 0.36rem;
`;
export const ContextListItem = styled.li`
  color: ${({ theme }) => theme.colors.blackMd};
  padding: 0.18rem;
  margin-bottom: 0.6rem;
  font-size: 0.8rem;
  padding-left: 1rem;
  cursor: pointer;
  text-transform: capitalize;
  &:hover {
    background-color: dodgerblue;
    color: ${({ theme }) => theme.colors.whiteMd};
  }
`;
export const HR = styled.hr`
  border-color: #ffffff82;
`;
