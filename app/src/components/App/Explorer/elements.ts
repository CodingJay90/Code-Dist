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
export const FolderBlock = styled.div<{ nested: boolean }>`
  transition: 0.1s linear;
  user-select: none;
  cursor: pointer;
  margin-left: ${(props) => (props.nested ? props.theme.spacing(8) : 0)};
`;
export const FolderWrapper = styled(StyledFlex)`
  margin-bottom: ${(props) => props.theme.spacing(8)};
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
// FILE ELEMENTS
export const FileContainer = styled(FolderBlock)`
  margin-left: ${(props) => props.theme.spacing(16)};
`;
export const FileWrapper = styled(FolderWrapper)``;
export const FileName = styled(FolderName)``;
export const FileIcon = styled.span``;
