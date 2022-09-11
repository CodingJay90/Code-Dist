import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0px;
  background-color: black;
  opacity: 0.7;
  z-index: 5;
`;

interface IProps {
  children: JSX.Element | React.ReactNode;
  closeModalOnBackdropClick: boolean;
  showBackDrop: boolean;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onModalClose?: () => void;
}

const ModalRoot = ({
  children,
  closeModalOnBackdropClick,
  showBackDrop,
  showModal,
  setShowModal,
}: IProps) => {
  return ReactDOM.createPortal(
    <>
      {showModal && showBackDrop && (
        <Backdrop onClick={() => setShowModal(false)} />
      )}
      {showModal && children}
    </>,
    document.getElementById("modal-root")!
  );
};

export default ModalRoot;
