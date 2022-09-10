import { StyledFlex } from "@/elements/Global";
import styled from "styled-components";

export const ModalHeaderContainer = styled(StyledFlex)``;
export const ModalHeaderTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 500;
  color: #706f6f;
  padding-left: 0.3rem;
`;
export const ModalHeaderButton = styled.button`
  background-color: transparent;
  border: none;
  width: 25px;
  padding: 0.3rem 0.3rem 0.2rem 0.3rem;
  text-align: center;
  color: #404040;
  cursor: default;
  :hover {
    background-color: #f44223;
    color: #fff;
  }
`;
export const ModalContentContainer = styled.div`
  width: 80%;
  margin: 1rem auto;
`;
export const ModalContentWrapper = styled.div`
  margin-bottom: 1rem;
`;
export const ModalContentMessage = styled.p`
  font-size: 1.3rem;
  font-weight: 400;
  color: #377cfc;
`;
export const ModalContentSubMessage = styled.p`
  font-size: 0.8rem;
  margin: ${(props) => props.theme.spacing(16)} 0;
`;
