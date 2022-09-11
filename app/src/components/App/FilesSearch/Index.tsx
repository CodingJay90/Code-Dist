import Arrow from "@/components/Icons/Arrow";
import { StyledContainer, StyledFlex } from "@/elements/Global";
import {
  VscRefresh,
  VscClearAll,
  VscNewFile,
  VscCollapseAll,
  VscReplaceAll,
  VscEllipsis,
  VscFile,
  VscClose,
} from "react-icons/vsc";
import {
  SearchContainer,
  SearchInputsArrow,
  SearchInputsContainer,
  SearchNav,
  SearchNavButton,
  SearchInputWrapper,
  SearchNavText,
  SearchInput,
  SearchInputMatchersWrapper,
  SearchInputMatchers,
  ReplaceInput,
  ReplaceButtonWrapper,
  ReplaceButton,
  ToggledInputsContainer,
  ToggledInputsWrapper,
  Label,
  ToggledInput,
  Span,
  Message,
  SearchResultContainer,
  SearchResultWrapperGrid,
  SearchResultWrapperGridItem,
  Icon,
  Name,
  Count,
  Result,
  ResultContainer,
  ResultText,
  ResultButtonWrapper,
  ResultActionButton,
} from "./elements";

const FilesSearch = () => {
  return (
    <SearchContainer>
      <SearchNav>
        <StyledFlex>
          <SearchNavText>search</SearchNavText>
          <StyledFlex>
            <SearchNavButton>
              <VscRefresh />
            </SearchNavButton>
            <SearchNavButton>
              <VscClearAll />
            </SearchNavButton>
            <SearchNavButton>
              <VscNewFile />
            </SearchNavButton>
            <SearchNavButton>
              <VscCollapseAll />
            </SearchNavButton>
          </StyledFlex>
        </StyledFlex>
      </SearchNav>
      <StyledFlex align="initial">
        <SearchInputsArrow>
          <Span>
            <Arrow direction="right" />
          </Span>
        </SearchInputsArrow>
        <SearchInputsContainer>
          <SearchInputWrapper>
            <SearchInput
              type="text"
              title="search"
              placeholder={`Search (${String.fromCharCode(
                8593
              )} ${String.fromCharCode(8595)} for history)`}
              autoComplete="off"
            />
            <SearchInputMatchersWrapper>
              <SearchInputMatchers id="match__case" title="Match case">
                Aa
              </SearchInputMatchers>
              <SearchInputMatchers
                id="match__whole__word"
                title="Match whole Word"
              >
                ab
              </SearchInputMatchers>
              <SearchInputMatchers id="regex" title="Use Regular Expression">
                *
              </SearchInputMatchers>
            </SearchInputMatchersWrapper>
          </SearchInputWrapper>
          <SearchInputWrapper>
            <ReplaceInput
              type="text"
              title="replace"
              placeholder="Replace"
              autoComplete="off"
            />
            <ReplaceButtonWrapper>
              <ReplaceButton>
                <VscReplaceAll />
              </ReplaceButton>
              <ReplaceButton>
                <VscEllipsis />
              </ReplaceButton>
            </ReplaceButtonWrapper>
          </SearchInputWrapper>
          <ToggledInputsContainer>
            <ToggledInputsWrapper>
              <Label htmlFor="to__include">files to include</Label>
              <ToggledInput
                type="text"
                id="to__include"
                name="to__include"
                placeholder="eg. *.ts, src/**/include"
              />
            </ToggledInputsWrapper>

            <ToggledInputsWrapper>
              <Label htmlFor="to__exclude">files to exclude</Label>
              <ToggledInput
                type="text"
                id="to__exclude"
                name="to__exclude"
                placeholder="eg. *.ts, src/**/include"
              />
            </ToggledInputsWrapper>
          </ToggledInputsContainer>
          <Message>
            No results found. Review your match cases and check your keywords
          </Message>
        </SearchInputsContainer>
      </StyledFlex>
      <SearchResultContainer width="100%">
        <Result>
          <SearchResultWrapperGrid>
            <SearchResultWrapperGridItem>
              <StyledFlex width="fit-content">
                <Arrow direction="right" />
                <Icon>
                  <VscFile />
                </Icon>
                <Name>index.html</Name>
              </StyledFlex>
            </SearchResultWrapperGridItem>
            <SearchResultWrapperGridItem>
              <Count>2</Count>
            </SearchResultWrapperGridItem>
          </SearchResultWrapperGrid>
          <ResultContainer>
            <ResultText>
              {'<meta charset="UTF-8">'}
              <ResultButtonWrapper>
                <ResultActionButton>
                  <VscClose />
                </ResultActionButton>
                <ResultActionButton>
                  <VscReplaceAll />
                </ResultActionButton>
              </ResultButtonWrapper>
            </ResultText>
          </ResultContainer>
        </Result>
      </SearchResultContainer>
    </SearchContainer>
  );
};

export default FilesSearch;
