import { StyledFlex } from "@/elements/Global";
import { VscCircleFilled } from "react-icons/vsc";
import styled from "styled-components";

export const PanelContainer = styled.div`
  width: 100%;
  height: auto;
`;
export const PanelContainerWrapper = styled(StyledFlex)`
  outline: 1px solid #706f6f;
  flex-wrap: wrap;
`;
export const PanelStatus = styled.span<{ visibility?: string }>`
  visibility: ${(props) => props.visibility};
  transition: all 0.2s linear;
  border-radius: 50%;
  text-align: center;
  font-size: 15px;
  position: relative;
  width: 15px;
  height: 15px;

  &::before {
    content: "x";
    text-align: center;
    position: absolute;
    background-color: #8892b0;
    color: #e6f1ff;
    cursor: pointer;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    text-align: center;
    width: 100%;
    height: 100%;
    font-size: 13px;
    border-radius: 4px;
    visibility: hidden;
  }
`;

export const Panel = styled.div<{ active: boolean }>`
  user-select: none;
  min-width: 150px;
  height: 2rem;
  max-height: 3rem;
  flex-grow: 1;
  outline: 1px solid #706f6f;
  margin-bottom: 1px;
  margin-right: 1px;
  cursor: pointer;
  background: ${(props) => (props.active ? "lightgrey" : "transparent")};

  :hover ${PanelStatus} {
    ::before {
      visibility: visible;
    }
  }
`;
export const PanelGroup = styled(StyledFlex)`
  height: 100%;
  padding: 0 0.5rem;
`;
export const PanelName = styled.span`
  font-size: 0.8rem;
`;
