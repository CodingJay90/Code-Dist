import FileIcon from "@/components/Icons/FileIcon";
import React from "react";
import {
  Panel,
  PanelContainer,
  PanelContainerWrapper,
  PanelGroup,
  PanelName,
  PanelStatus,
} from "./elements";

const OpenedEditorsPanel = () => {
  return (
    <PanelContainer>
      <PanelContainerWrapper justify="flex-start">
        <Panel>
          <PanelGroup>
            <FileIcon />
            <PanelName>app.rb</PanelName>
            <PanelStatus></PanelStatus>
          </PanelGroup>
        </Panel>
      </PanelContainerWrapper>
    </PanelContainer>
  );
};

export default OpenedEditorsPanel;
