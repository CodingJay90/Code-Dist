import { StyledFlex } from "@/elements/Global";
import { VscCircleFilled } from "react-icons/vsc";
import styled from "styled-components";

export const PanelContainer = styled.div`
  width: 100%;
  height: auto;
  border-bottom: 1px solid ${({ theme }) => theme.colors.blackMd};
`;
export const PanelContainerWrapper = styled(StyledFlex)`
  flex-wrap: wrap;
  /* background: ${({ theme }) => theme.colors.mainLight}; */
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
    /* background-color: transparent; */
    color: ${({ theme }) => theme.colors.blackMd};
    cursor: pointer;
    top: -1px;
    bottom: 0;
    right: 0;
    left: 0;
    text-align: center;
    width: 100%;
    height: 100%;
    font-size: 13px;
    border-radius: 4px;
    visibility: hidden;

    background-color: ${({ theme }) => theme.colors.mainDark};
    :hover {
      background-color: ${({ theme }) => theme.colors.mainDark};
    }
  }
`;

export const Panel = styled.div<{ active: boolean }>`
  user-select: none;
  min-width: 120px;
  height: 2rem;
  max-height: 3rem;
  /* border: 1px solid #000; */
  width: fit-content;
  /* flex-grow: 1; */
  /* outline: 1px solid #706f6f; */
  margin: 1px;
  cursor: pointer;
  /* background: ${(props) => (props.active ? "lightgrey" : "transparent")}; */
  background: ${({ active, theme }) =>
    active ? theme.colors.mainDark : theme.colors.mainLight};

  :hover ${PanelStatus} {
    ::before {
      visibility: visible;
    }
  }
`;
export const PanelGroup = styled(StyledFlex)`
  height: 100%;
  padding: 0 0.5rem;
  gap: 5px;
`;
export const PanelName = styled.span`
  font-size: 0.8rem;
`;
