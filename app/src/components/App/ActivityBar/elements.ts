import { StyledContainer } from "@/elements/Global";
import styled from "styled-components";

export const Container = styled.div`
  min-width: 60px;
  max-width: 70px;
  min-height: 92vh;
  padding-top: 1rem;
  border-right: 1px solid grey;
`;
export const IconWrapper = styled(StyledContainer)`
  margin-bottom: ${(props) => props.theme.spacing(32)};
  cursor: pointer;
`;
