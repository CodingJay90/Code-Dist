import { StyledContainer } from "@/elements/Global";
import styled from "styled-components";

export const Container = styled.div`
  min-width: 45px;
  max-width: 70px;
  min-height: 92vh;
  padding-top: 1rem;
  border-right: 1px solid grey;
  background-color: ${({ theme }) => theme.colors.blackMd};
  /* background-color: #f5f5f5; */
`;
export const IconWrapper = styled(StyledContainer)<{ active: boolean }>`
  margin-bottom: ${(props) => props.theme.spacing(32)};
  opacity: ${({ active }) => (active ? 1 : 0.5)};
  cursor: pointer;
  :hover {
    opacity: 1;
  }
`;
