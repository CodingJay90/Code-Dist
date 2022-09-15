import { useState } from "react";
import { IFile } from "@/graphql/models/app.interface";
import Arrow from "@/components/Icons/Arrow";
import { StyledFlex } from "@/elements/Global";
import {
  NavButton,
  NavButtonList,
  NavButtonListItem,
  Status,
  WorkSpaceName,
  Wrapper,
} from "./elements";
import {
  VscNewFile,
  VscNewFolder,
  VscRefresh,
  VscCollapseAll,
  VscSaveAll,
  VscCloseAll,
  VscCircleFilled,
} from "react-icons/vsc";
import { useInteractionContext } from "@/contexts/interactions/InteractionContextProvider";
import { useAppSelector } from "@/reduxStore/hooks";
import {
  FileContainer,
  FileIcon,
  FileName,
  FileWrapper,
} from "@/components/App/Explorer/elements";
import { FcFile } from "react-icons/fc";
import { useAppDispatch } from "@/reduxStore/hooks";
import {
  addToOpenedFiles,
  setActiveOpenedFile,
  removeFileFromOpenedFiles,
} from "@/reduxStore/app/appSlice";
import CloseEditedFileModal from "@/components/Modal/CloseEditedFileModal/Index";

const OpenedEditorsNav = () => {
  const [toggleOpenEditors, setToggleOpenEditors] = useState<boolean>(false);
  const [showDialogModal, setShowDialogModal] = useState<boolean>(false);
  const [fileToClose, setFileToClose] = useState<string>("");
  const dispatch = useAppDispatch();
  const { openedFiles } = useAppSelector((state) => state.app);

  function selectFile(file: IFile): void {
    dispatch(setActiveOpenedFile(file));
    dispatch(addToOpenedFiles(file));
  }

  function closeFile(file: IFile): void {
    if (file.isModified) {
      setFileToClose(file.file_name);
      setShowDialogModal(true);
    } else {
      dispatch(removeFileFromOpenedFiles(file._id));
    }
  }

  return (
    <>
      <Wrapper>
        <StyledFlex>
          <StyledFlex
            justify="flex-start"
            onClick={() => setToggleOpenEditors(!toggleOpenEditors)}
          >
            <Arrow direction={toggleOpenEditors ? "right" : "down"} />
            <WorkSpaceName>opened editors</WorkSpaceName>
          </StyledFlex>
          <NavButtonList>
            <NavButtonListItem title="New Untitled File">
              <VscNewFile />
            </NavButtonListItem>
            <NavButtonListItem title="Save All">
              <VscSaveAll />
            </NavButtonListItem>
            <NavButtonListItem title="Close All Editors">
              <VscCloseAll />
            </NavButtonListItem>
          </NavButtonList>
        </StyledFlex>
      </Wrapper>
      {openedFiles.map((file) => (
        <FileContainer
          nested={true}
          key={file.file_id}
          onClick={() => selectFile(file)}
        >
          <FileWrapper justify="flex-start">
            <Status
              visibilityStatus={file.isModified ?? false}
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file);
              }}
            >
              {file.isModified && <VscCircleFilled />}
            </Status>
            <FileIcon>
              <FcFile />
            </FileIcon>
            <FileName>{file.file_name}</FileName>
          </FileWrapper>
        </FileContainer>
      ))}
      <CloseEditedFileModal
        showModal={showDialogModal}
        setShowModal={setShowDialogModal}
        message={`Do you want to make changes made to ${fileToClose}?`}
        subMessage="Your changes will be lost if you don't save them."
      />
    </>
  );
};

export default OpenedEditorsNav;
