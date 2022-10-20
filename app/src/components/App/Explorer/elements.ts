import Arrow from "@/components/Icons/Arrow";
import Folder from "@/components/Icons/FolderIcon";
import { StyledFlex } from "@/elements/Global";
import styled from "styled-components";

export const Container = styled.div`
  user-select: none;
  border-right: 1px solid grey;
  min-width: 230px;
  max-width: 300px;
`;
export const FolderBlockContainer = styled.div``;
export const FolderBlock = styled.div<{ nested: boolean; isHovered?: boolean }>`
  transition: 0.1s linear;
  user-select: none;
  cursor: pointer;
  margin-left: ${(props) => (props.nested ? props.theme.spacing(8) : 0)};
  opacity: ${({ isHovered }) => (isHovered ? 0.5 : 1)};
`;
export const FolderWrapper = styled(StyledFlex)<{ fileHovered?: boolean }>`
  margin-bottom: ${(props) => props.theme.spacing(8)};
  background: ${({ fileHovered }) => (fileHovered ? "#eee" : "#fff")};
`;
export const FolderArrowIcon = styled(Arrow)`
  margin-right: ${(props) => props.theme.spacing(8)};
`;
export const FolderIcon = styled(Folder)`
  margin-right: ${(props) => props.theme.spacing(8)};
`;
export const FolderName = styled.div`
  margin-left: ${(props) => props.theme.spacing(8)};
  font-size: ${(props) => props.theme.spacing(12)};
`;
export const NestedFolder = styled.div``;
export const FolderDropWrapper = styled.div<{ isHovered?: boolean }>`
  opacity: ${({ isHovered }) => (isHovered ? 0.5 : 1)};
`;
export const FolderDragWrapper = styled.div<{ isDragged?: boolean }>`
  opacity: ${({ isDragged }) => (isDragged ? 0.5 : 1)};
`;
// FILE ELEMENTS
export const FileContainer = styled(FolderBlock)`
  margin-left: 20px;
`;
export const FileWrapper = styled(FolderWrapper)<{ isDragged?: boolean }>`
  opacity: ${({ isDragged }) => (isDragged ? 0.5 : 1)};
`;
export const FileName = styled(FolderName)``;
export const FileIcon = styled.span``;
