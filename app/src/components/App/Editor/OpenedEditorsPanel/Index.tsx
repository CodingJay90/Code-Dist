import { useState } from "react";
import FileIcon from "@/components/Icons/FileIcon";
import { useAppDispatch, useAppSelector } from "@/reduxStore/hooks";
import {
  removeFileFromOpenedFiles,
  setActiveOpenedFile,
} from "@/reduxStore/app/appSlice";
import {
  Panel,
  PanelContainer,
  PanelContainerWrapper,
  PanelGroup,
  PanelName,
  PanelStatus,
} from "./elements";
import { FcFile } from "react-icons/fc";
import { IFile } from "@/graphql/models/app.interface";
import CloseEditedFileModal from "@/components/Modal/CloseEditedFileModal/Index";
import { VscCircleFilled } from "react-icons/vsc";
import { useInteractionContext } from "@/contexts/interactions/InteractionContextProvider";

const OpenedEditorsPanel = () => {
  const [showDialogModal, setShowDialogModal] = useState<boolean>(false);
  const [panelStatusVisibility, setPanelStatusVisibility] =
    useState<boolean>(true);
  const [fileToClose, setFileToClose] = useState<IFile | null>(null);
  const { editorInteractions, setEditorInteractionsState } =
    useInteractionContext();
  const dispatch = useAppDispatch();
  const { openedFiles, activeOpenedFile } = useAppSelector(
    (state) => state.app
  );
  function onFileClose(e: React.MouseEvent, file: IFile): void {
    e.stopPropagation();
    if (file.isModified) {
      // setFileToClose(file);
      // setShowDialogModal(true);
      setEditorInteractionsState({
        ...editorInteractions,
        showCloseFileDialogModal: true,
        fileToClose: file,
      });
    } else {
      dispatch(removeFileFromOpenedFiles(file._id));
    }
  }
  return (
    <PanelContainer>
      <PanelContainerWrapper justify="flex-start">
        {openedFiles.map((file) => (
          <Panel
            key={file._id}
            onClick={() => dispatch(setActiveOpenedFile(file))}
            active={file._id === activeOpenedFile?._id}
          >
            <PanelGroup>
              <FcFile />
              <PanelName>{file.file_name}</PanelName>
              <PanelStatus
                // visibility={panelStatusVisibility ? "visible" : "hidden"}
                onClick={(e) => onFileClose(e, file)}
                // onMouseOver={() =>
                //   setPanelStatusVisibility(file.isModified ?? false)
                // }
                // onMouseOut={() =>
                //   setPanelStatusVisibility(!!file.isModified ?? true)
                // }
              >
                {file.isModified && <VscCircleFilled />}
              </PanelStatus>
            </PanelGroup>
          </Panel>
        ))}
      </PanelContainerWrapper>
      {/* <CloseEditedFileModal
        showModal={showDialogModal}
        setShowModal={setShowDialogModal}
        onDontSaveClick={() => {
          if (!fileToClose) return;
          dispatch(removeFileFromOpenedFiles(fileToClose._id));
          setShowDialogModal(false);
        }}
        message={`Do you want to make changes made to ${fileToClose}?`}
        subMessage="Your changes will be lost if you don't save them."
      /> */}
    </PanelContainer>
  );
};

export default OpenedEditorsPanel;
