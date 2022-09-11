import { StyledFlex } from "@/elements/Global";
import styled from "styled-components";

export const MenuBarContainer = styled.div`
  height: 4vh;
  border-bottom: 1px solid grey;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
`;
export const MenuBarGroup = styled(StyledFlex)`
  height: 100%;
`;
export const MenuBarButtonContainer = styled(StyledFlex)`
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
export const InfoContainer = styled(StyledFlex)``;
export const FileName = styled.div`
  text-transform: lowercase;
  font-size: 13px;
  margin-right: ${(props) => props.theme.spacing(4)};
`;
export const DirName = styled.div`
  text-transform: uppercase;
  font-weight: normal;
  font-size: 15px;
  margin-right: ${(props) => props.theme.spacing(4)};
`;
export const Status = styled.div`
  width: 10px;
  height: 10px;
  background: lightgrey;
  border-radius: 50%;
  margin-right: ${(props) => props.theme.spacing(4)};
`;
export const Brand = styled.div`
  text-transform: capitalize;
  font-size: 15px;
`;
export const ViewContainer = styled.div``;
