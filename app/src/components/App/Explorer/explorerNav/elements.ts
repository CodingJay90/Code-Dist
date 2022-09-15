import Arrow from "@/components/Icons/Arrow";
import Folder from "@/components/Icons/FolderIcon";
import { StyledFlex } from "@/elements/Global";
import styled from "styled-components";

export const Wrapper = styled.div`
  background-color: whitesmoke;
  padding: ${(props) => props.theme.spacing(4)} 0;
  cursor: pointer;
`;
export const NavButtonList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const NavButtonListItem = styled.button`
  margin-right: ${(props) => props.theme.spacing(4)};
  cursor: pointer;
  transition: all 0.2s linear;
  border-radius: ${(props) => props.theme.spacing(4)};
  width: 20px;
  text-align: center;
  font-size: ${(props) => props.theme.spacing(16)};
  border: none;
  background: transparent;
  cursor: pointer;
`;
export const NavButton = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
`;
export const WorkSpaceName = styled.span`
  margin-left: ${(props) => props.theme.spacing(4)};
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 600;
`;
export const Status = styled.span<{ visibilityStatus: boolean }>`
  transition: all 0.2s linear;
  border-radius: 50%;
  text-align: center;
  font-size: 15px;
  position: relative;
  width: 15px;
  height: 15px;
  visibility: ${(props) => (props.visibilityStatus ? "visible" : "hidden")};

  &::before {
    content: "x";
    text-align: center;
    position: absolute;
    color: #333;
    background: transparent;
    cursor: pointer;
    top: -3px;
    bottom: 0;
    right: 0;
    left: 0;
    text-align: center;
    width: 100%;
    height: 100%;
    font-size: 13px;
    border-radius: 4px;
    visibility: ${(props) => (!props.visibilityStatus ? "visible" : "hidden")};
  }
`;
