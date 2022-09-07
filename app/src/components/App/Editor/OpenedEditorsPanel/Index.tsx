import FileIcon from "@/components/Icons/FileIcon";
import { useAppDispatch, useAppSelector } from "@/reduxStore/hooks";
import { setActiveOpenedFile } from "@/reduxStore/app/appSlice";
import {
  Panel,
  PanelContainer,
  PanelContainerWrapper,
  PanelGroup,
  PanelName,
  PanelStatus,
} from "./elements";
import { FcFile } from "react-icons/fc";

const OpenedEditorsPanel = () => {
  const dispatch = useAppDispatch();
  const { openedFiles } = useAppSelector((state) => state.app);
  return (
    <PanelContainer>
      <PanelContainerWrapper justify="flex-start">
        {openedFiles.map((i) => (
          <Panel key={i._id} onClick={() => dispatch(setActiveOpenedFile(i))}>
            <PanelGroup>
              {/* <FileIcon /> */}
              <FcFile />
              <PanelName>{i.file_name}</PanelName>
              <PanelStatus></PanelStatus>
            </PanelGroup>
          </Panel>
        ))}
      </PanelContainerWrapper>
    </PanelContainer>
  );
};

export default OpenedEditorsPanel;
