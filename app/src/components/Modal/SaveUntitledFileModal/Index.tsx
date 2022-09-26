import React, { useState } from "react";
import {
  NativeModalBackdrop,
  NativeModalButton,
  NativeModalContainer,
  NativeModalHeader,
  NativeModalFooter,
  NativeModalFooterContainer,
} from "@/components/Modal/elements";
import ModalRoot from "@/components/Modal/ModalRoot";
import { StyledFlex } from "@/elements/Global";
import {
  DirectoryList,
  DirectoryListItem,
  DirectoryName,
  Error,
  Input,
  ModalContentContainer,
  ModalContentMessage,
  ModalContentSubMessage,
  ModalContentWrapper,
  ModalHeaderButton,
  ModalHeaderContainer,
  ModalHeaderTitle,
  RadioSelect,
} from "./elements";
import FolderIcon from "@/components/Icons/FolderIcon";
import { IDirectory } from "@/graphql/models/app.interface";
import { useCreateFile } from "@/graphql/mutations/app.mutations";

interface IProps {
  directories: IDirectory[];
  showModal: boolean;
  setShowModal: (
    state: boolean
  ) => void | React.Dispatch<React.SetStateAction<boolean>>;
  defaultFileName: string;
  onDontSaveClick: () => void;
}

const SaveUntitledFileModal = ({
  showModal,
  setShowModal,
  directories,
  onDontSaveClick,
  defaultFileName,
}: IProps) => {
  const [directoryPathToAddUntitledFile, setDirectoryPathToAddUntitledFile] =
    useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { createFile } = useCreateFile({
    dir: directoryPathToAddUntitledFile,
    fileName,
  });

  function closeModal(): void {
    setShowModal(false);
  }
  return (
    <>
      <ModalRoot
        showModal={showModal}
        setShowModal={setShowModal}
        closeModalOnBackdropClick={false}
        showBackDrop={false}
      >
        <NativeModalBackdrop onClick={closeModal} />
        <NativeModalContainer>
          <ModalHeaderContainer>
            <ModalHeaderTitle onClick={closeModal}>Save File</ModalHeaderTitle>
            <ModalHeaderButton onClick={closeModal}>X</ModalHeaderButton>
          </ModalHeaderContainer>
          <ModalContentContainer>
            <ModalContentWrapper>
              <ModalContentMessage>
                Select Directory to add file to
              </ModalContentMessage>

              <DirectoryList>
                {directories.map((dir) => (
                  <DirectoryListItem key={dir._id}>
                    <StyledFlex>
                      <StyledFlex justify="flex-start">
                        <FolderIcon />
                        <DirectoryName>{dir.directory_name}</DirectoryName>
                      </StyledFlex>
                      <RadioSelect
                        type="radio"
                        name="directory-select"
                        value={dir.directory_path}
                        onChange={() =>
                          setDirectoryPathToAddUntitledFile(dir.directory_path)
                        }
                      />
                    </StyledFlex>
                  </DirectoryListItem>
                ))}
              </DirectoryList>
              <Error>{errorMessage}</Error>
            </ModalContentWrapper>
          </ModalContentContainer>
          <NativeModalFooter>
            <StyledFlex>
              <Input
                type="text"
                defaultValue={defaultFileName}
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
              <NativeModalFooterContainer>
                <NativeModalButton
                  disabled={!directoryPathToAddUntitledFile || !fileName}
                  onClick={() => {
                    // if(!directoryPathToAddUntitledFile || !fileName) {

                    //     return
                    // }
                    createFile();
                    closeModal();
                  }}
                >
                  Confirm
                </NativeModalButton>
                <NativeModalButton onClick={onDontSaveClick}>
                  Don't save
                </NativeModalButton>
                <NativeModalButton onClick={closeModal}>
                  cancel
                </NativeModalButton>
              </NativeModalFooterContainer>
            </StyledFlex>
          </NativeModalFooter>
        </NativeModalContainer>
      </ModalRoot>
    </>
  );
};

export default SaveUntitledFileModal;
