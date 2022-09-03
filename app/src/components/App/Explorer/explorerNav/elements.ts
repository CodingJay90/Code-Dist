import Arrow from "@/components/Icons/Arrow";
import Folder from "@/components/Icons/Folder";
import { StyledFlex } from "@/elements/Global";
import styled from "styled-components";

export const Wrapper = styled.div`
  background-color: whitesmoke;
  padding: ${(props) => props.theme.spacing(4)};
  padding-left: ${(props) => props.theme.spacing(8)};
`;
export const NavButtonList = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
`;
export const NavButtonListItem = styled.li`
  margin-right: ${(props) => props.theme.spacing(4)};
  cursor: pointer;
  transition: all 0.2s linear;
  border-radius: ${(props) => props.theme.spacing(4)};
  width: 20px;
  text-align: center;
  font-size: ${(props) => props.theme.spacing(16)};
`;
export const WorkSpaceName = styled.span`
  margin-left: ${(props) => props.theme.spacing(8)};
  font-size: ${(props) => props.theme.spacing(12)};
  text-transform: uppercase;
  font-weight: 600;
`;
