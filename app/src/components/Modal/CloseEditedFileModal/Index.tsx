import React from "react";
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
  ModalContentContainer,
  ModalContentMessage,
  ModalContentSubMessage,
  ModalContentWrapper,
  ModalHeaderButton,
  ModalHeaderContainer,
  ModalHeaderTitle,
} from "./elements";

interface IProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  subMessage: string;
}

const CloseEditedFileModal = ({
  showModal,
  setShowModal,
  message,
  subMessage,
}: IProps) => {
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
            <ModalHeaderTitle onClick={closeModal}>Warning ⚠</ModalHeaderTitle>
            <ModalHeaderButton onClick={closeModal}>X</ModalHeaderButton>
          </ModalHeaderContainer>
          <ModalContentContainer>
            <ModalContentWrapper>
              <ModalContentMessage>{message}</ModalContentMessage>
              <ModalContentSubMessage>{subMessage}</ModalContentSubMessage>
            </ModalContentWrapper>
          </ModalContentContainer>
          <NativeModalFooter>
            <NativeModalFooterContainer>
              <NativeModalButton>save</NativeModalButton>
              <NativeModalButton>Don't save</NativeModalButton>
              <NativeModalButton onClick={closeModal}>cancel</NativeModalButton>
            </NativeModalFooterContainer>
          </NativeModalFooter>
        </NativeModalContainer>
      </ModalRoot>
    </>
  );
};

export default CloseEditedFileModal;
