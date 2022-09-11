import styled from "styled-components";

export const NativeModalBackdrop = styled.div`
  height: 100vh;
  width: 100vw;
  z-index: 4;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.8);
  filter: blur(2px);
`;
export const NativeModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 450px;
  transform: translate(calc(50vw - 50%), calc(50vh - 50%));
  z-index: 5;
  background-color: #fff;
  box-shadow: 0px 0px 0px 3px rgba(0, 0, 0, 0.056),
    0px 0px 0px 3px rgba(0, 0, 0, 0.054);
  border: 2px solid #404040;
`;
export const NativeModalHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 450px;
  z-index: 5;
  background-color: #fff;
  box-shadow: 0px 0px 0px 3px rgba(0, 0, 0, 0.056),
    0px 0px 0px 3px rgba(0, 0, 0, 0.054);
  border: 2px solid #404040;
`;
export const NativeModalButton = styled.button`
  min-width: 50px;
  display: inline-block;
  border: 1px solid $grey;
  padding: 0.1rem 0.3rem;
  margin-right: 0.5rem;
  text-transform: capitalize;
  &:hover {
    background-color: #b3e6fd;
    border: 1px solid #377cfc;
  }
`;
export const NativeModalFooter = styled.div`
  background-color: #f6f4f4;
`;
export const NativeModalFooterContainer = styled.div`
  width: 50%;
  margin-left: auto;
  display: flex;
  justify-content: flex-start;
  padding: 0.6rem 0;
`;
