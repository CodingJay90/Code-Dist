import { StyledContainer, StyledFlex } from "@/elements/Global";
import styled from "styled-components";

export const SearchContainer = styled.div``;
export const SearchNav = styled.div`
  width: 90%;
  margin: auto;
  padding: 0.7rem 0;
`;
export const SearchNavText = styled(StyledFlex)`
  margin-left: ${(props) => props.theme.spacing(8)};
  font-size: 10px;
  font-weight: 400;
  text-transform: uppercase;
`;
export const SearchNavButton = styled.button`
  margin-right: 0.2rem;
  cursor: pointer;
  transition: all 0.2s linear;
  border-radius: 3px;
  width: 23px;
  text-align: center;
  font-size: 0.8rem;
  background: transparent;
  border: none;

  :hover {
    background-color: #e2e2e2;
  }
  :disabled {
    cursor: default;
    background-color: transparent;
  }
`;

// export const SearchInputsContainer = styled(StyledFlex)`
//   width: 100%;
// `;
export const Span = styled.span`
  transition: all 0.2s linear;
  padding: 1rem 0.15rem;
  cursor: pointer;
  transition: all 0.2s linear;

  :hover {
    background-color: #e2e2e2;
  }
`;
export const SearchInputsArrow = styled.div`
  width: 10%;
  margin-top: 10%;
  text-align: center;
`;
export const SearchInputsContainer = styled.div`
  width: 90%;
`;
export const SearchInputWrapper = styled(StyledFlex)`
  margin-bottom: 0.7rem;
  position: relative;
  height: 2rem;
  width: 95%;
`;
export const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  :focus {
    outline: 1px solid #57cbff;
    border: none;
  }
`;
export const SearchInputMatchersWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 2%;
  top: 20%;
`;
export const SearchInputMatchers = styled.span<{ active: boolean }>`
  font-size: 0.8rem;
  transition: all 0.2s linear;
  cursor: pointer;
  padding: 0.1rem;
  border-radius: 0.2rem;
  font-weight: 500;
  margin-left: 2px;
  background: ${(props) => (props.active ? " #57cbff" : "transparent")};
  &:hover {
    background-color: #e2e2e2;
  }
  &:focus {
    outline: none;
    border: 1px solid #57cbff;
  }
`;
export const ReplaceInput = styled(SearchInput)`
  width: 85%;
`;
export const ReplaceButtonWrapper = styled.div`
  width: 13%;
  margin-left: auto;
`;
export const ReplaceButton = styled.button`
  background-color: transparent;
  border: none;
  margin-left: 0.3rem;
  width: 100%;
  height: 100%;
  transition: all 0.2s linear;
  border-radius: 3px;
  font-size: 1.1rem;
  &:hover {
    background-color: #e2e2e2;
  }
`;

export const ToggledInputsContainer = styled.div``;
export const ToggledInputsWrapper = styled.div`
  width: 95%;
  margin-bottom: 0.3rem;
`;
export const ToggledInput = styled.input`
  width: 100%;
  height: 1.7rem;
  &:focus {
    outline: 1px solid #57cbff;
    border: none;
  }
  &::placeholder {
    padding-left: 0.22rem;
    font-size: 0.7rem;
  }
`;
export const Label = styled.label`
  font-size: 0.7rem;
  font-weight: 400;
  color: #404040;
`;
export const Message = styled.p`
  text-align: left;
  font-size: 0.7rem;
  font-weight: 300;
  margin-top: 1rem;
  color: #f44223;
`;
export const Result = styled.div``;
export const SearchResultContainer = styled(StyledContainer)`
  margin-top: 1rem;
  padding: 3px 0;
  height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
`;
export const SearchResultWrapperGrid = styled(StyledFlex)`
  display: grid;
  grid-template-columns: 10fr 2fr;
  align-items: center;
  text-align: right;
  cursor: pointer;

  &:hover {
    background-color: #e2e2e2;
  }
`;
export const SearchResultWrapperGridItem = styled(StyledFlex)`
  display: flex;
  width: 90%;
  margin: auto;
  &:nth-of-type(2) {
    justify-content: center;
  }
`;
export const Name = styled.span`
  font-size: 0.8rem;
  margin-left: 10px;
`;
export const Icon = styled.span`
  width: 1rem;
  height: 1rem;
`;
export const Count = styled.span`
  font-size: 0.8rem;
  margin-right: 0 !important;
  text-align: right;
  border-radius: 0.5rem;
  position: relative;
  width: 18px;
  height: 18px;
  text-align: center;
  border-radius: 50%;
  &::before {
    content: "x";
    position: absolute;
    background-color: #706f6f;
    color: white;
    cursor: pointer;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border-radius: 50%;
    text-align: center;
    width: 15px;
    height: 15px;
    visibility: hidden;
  }
  &:hover:before {
    border-radius: 4px;
    background: #706f6f;
    visibility: visible;
  }
`;
export const ResultContainer = styled.div`
  margin: 0.5rem 0;
`;
export const ResultButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: #fff;
  visibility: hidden;
  :hover {
    background: #e2e2e2;
  }
`;
export const ResultText = styled.div`
  font-size: 0.7rem;
  cursor: pointer;
  position: relative;

  padding: 3px 0;
  margin-bottom: 4px;
  :hover {
    background: #e2e2e2;
    ${ResultButtonWrapper} {
      visibility: visible;
      background: #e2e2e2;
    }
  }
`;
export const ResultTextWrapper = styled.div`
  width: 85%;
  margin-left: auto;
`;
export const Text = styled.span`
  white-space: nowrap;
  overflow: hidden;
`;

export const ResultActionButton = styled.button`
  background: transparent;
  border: none;
  margin-right: 8px;
  cursor: pointer;
`;
