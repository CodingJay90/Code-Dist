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
export const FolderHover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: red;
  height: 20px;
  z-index: -1;
`;
export const FolderBlockContainer = styled.div`
  height: 96vh;
  overflow-y: auto;
`;
export const FolderBlock = styled.div<{ nested: boolean; isHovered?: boolean }>`
  transition: 0.1s linear;
  user-select: none;
  cursor: pointer;
  /* margin-left: ${(props) => (props.nested ? props.theme.spacing(8) : 0)}; */
  /* padding-left: ${(props) => (props.nested ? props.theme.spacing(8) : 0)}; */
  opacity: ${({ isHovered }) => (isHovered ? 0.5 : 1)};
`;
export const FolderWrapper = styled(StyledFlex)<{
  fileHovered?: boolean;
  nested?: boolean;
}>`
  margin-bottom: ${(props) => props.theme.spacing(8)};
  background: ${({ fileHovered }) => (fileHovered ? "#eee" : "initial")};
  /* padding-left: ${(props) => (props.nested ? props.theme.spacing(8) : 0)}; */
`;
export const FolderNest = styled.div<{
  nested?: boolean;
}>`
  margin-left: ${(props) => (props.nested ? props.theme.spacing(16) : 0)};
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
export const NestedFolder = styled.div`
  position: relative;
  padding-left: 8px;
  border-left: 1px solid #eee;
`;
export const FolderDropWrapper = styled.div<{
  isHovered?: boolean;
  nested?: boolean;
}>`
  opacity: ${({ isHovered }) => (isHovered ? 0.5 : 1)};
  /* margin-left: ${(props) => (props.nested ? props.theme.spacing(16) : 0)}; */
`;
export const FolderDragWrapper = styled.div<{ isDragged?: boolean }>`
  opacity: ${({ isDragged }) => (isDragged ? 0.5 : 1)};
  position: relative;
  /* :before {
    content: "";
    background-color: green;
    height: 100%;
    width: 100%;
    position: absolute;
    left: -8px;
    z-index: -1;
  } */
  :hover {
    background: ${({ theme }) => theme.colors.blackMd};
    /* :before {
      background: ${({ theme }) => theme.colors.blackMd};
    } */
    ${FolderName} {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;
// FILE ELEMENTS
export const FileContainer = styled(FolderBlock)`
  margin-left: 20px;
  :hover {
    background: ${({ theme }) => theme.colors.blackMd};
    ${FolderName} {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;
export const FileWrapper = styled(FolderWrapper)<{ isDragged?: boolean }>`
  opacity: ${({ isDragged }) => (isDragged ? 0.5 : 1)};
`;
export const FileName = styled(FolderName)``;
export const FileIcon = styled.span``;
