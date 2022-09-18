import { useState } from "react";
import { IFile } from "@/graphql/models/app.interface";
import Arrow from "@/components/Icons/Arrow";
import { StyledFlex } from "@/elements/Global";
import uid from "shortid";
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
  removeAllFilesOnView,
} from "@/reduxStore/app/appSlice";
import CloseEditedFileModal from "@/components/Modal/CloseEditedFileModal/Index";

const OpenedEditorsNav = () => {
  const [toggleOpenEditors, setToggleOpenEditors] = useState<boolean>(false);
  const [showDialogModal, setShowDialogModal] = useState<boolean>(false);
  const [fileToClose, setFileToClose] = useState<IFile | null>(null);
  const dispatch = useAppDispatch();
  const { openedFiles } = useAppSelector((state) => state.app);
  const { editorInteractions, setEditorInteractionsState } =
    useInteractionContext();
  function selectFile(file: IFile): void {
    dispatch(setActiveOpenedFile(file));
    dispatch(addToOpenedFiles(file));
  }

  function closeFile(file: IFile): void {
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

  function closeAllOpenedFiles(): void {
    dispatch(removeAllFilesOnView());
  }

  function openNewUntitledFile(): void {
    const untitledFiles = openedFiles.filter(
      (i) => i.file_name.includes("Untitled") && i.file_type === ""
    );
    const untitledFile: IFile = {
      file_name: `Untitled- ${untitledFiles.length + 1}`,
      file_id: uid(),
      _id: uid(),
      file_dir: "",
      file_content: "",
      file_type: "",
      isDirectory: false,
    };
    dispatch(setActiveOpenedFile(untitledFile));
    dispatch(addToOpenedFiles(untitledFile));
  }

  function saveAllOpenedFile(): void {
    const filesToSave = openedFiles.filter((file) => file.isModified);
    console.log(filesToSave);
  }

  return (
    <>
      <Wrapper>
        <StyledFlex>
          <StyledFlex
            justify="flex-start"
            onClick={() => setToggleOpenEditors(!toggleOpenEditors)}
          >
            <Arrow direction={toggleOpenEditors ? "down" : "right"} />
            <WorkSpaceName>opened editors</WorkSpaceName>
          </StyledFlex>
          <NavButtonList>
            <NavButtonListItem
              title="New Untitled File"
              onClick={openNewUntitledFile}
            >
              <VscNewFile />
            </NavButtonListItem>
            <NavButtonListItem title="Save All" onClick={saveAllOpenedFile}>
              <VscSaveAll />
            </NavButtonListItem>
            <NavButtonListItem
              title="Close All Editors"
              onClick={closeAllOpenedFiles}
            >
              <VscCloseAll />
            </NavButtonListItem>
          </NavButtonList>
        </StyledFlex>
      </Wrapper>
      {toggleOpenEditors &&
        openedFiles.map((file) => (
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
      {/* <CloseEditedFileModal
        showModal={showDialogModal}
        setShowModal={setShowDialogModal}
        onDontSaveClick={() => {
          if (!fileToClose) return;
          dispatch(removeFileFromOpenedFiles(fileToClose._id));
          setShowDialogModal(false);
        }}
        onSaveClick={() => {}}
        message={`Do you want to make changes made to ${
          fileToClose?.file_name ?? ""
        }?`}
        subMessage="Your changes will be lost if you don't save them."
      /> */}
    </>
  );
};

export default OpenedEditorsNav;
