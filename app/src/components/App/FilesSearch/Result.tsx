import { useState, useEffect } from "react";
import { IFile } from "@/graphql/models/app.interface";
import { StyledContainer, StyledFlex } from "@/elements/Global";
import Arrow from "@/components/Icons/Arrow";
import {
  VscRefresh,
  VscClearAll,
  VscNewFile,
  VscCollapseAll,
  VscReplaceAll,
  VscEllipsis,
  VscFile,
  VscClose,
  VscCaseSensitive,
  VscRegex,
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
  Result as ResultWrapper,
  ResultContainer,
  ResultText,
  ResultButtonWrapper,
  ResultActionButton,
  ResultTextWrapper,
  Text,
} from "./elements";

interface IProps {
  result: { file: IFile; lines: string[] };
  searchQuery: string;
}

const Result = ({ result, searchQuery }: IProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [resultsToShow, setResultsToShow] = useState<number>(10);

  useEffect(() => {
    if (resultsToShow > 10 && !expanded) setResultsToShow(10); //resets the amount of elements rendered in the dom back to 10 to prevent having too much nodes sitting around in the dom
  }, [expanded]);

  const resultText = (text: string) =>
    text.replace(searchQuery, `<span>${searchQuery}</span>`);

  const showMoreButtonVisible =
    expanded &&
    result.lines.length > 10 &&
    result.lines.length >= resultsToShow;

  const t = (str: string) => {
    str
      .substring(0, 25)
      .replace(
        searchQuery,
        (highlight) =>
          `<span style="background-color: yellow">${highlight}</span>`
      );
  };

  return (
    <ResultWrapper onClick={() => setExpanded(!expanded)}>
      <SearchResultWrapperGrid title={result.file.file_dir}>
        <SearchResultWrapperGridItem>
          <StyledFlex width="fit-content">
            <Arrow direction={expanded ? "down" : "right"} />
            <Icon>
              <VscFile />
            </Icon>
            <Name>{result.file.file_name}</Name>
          </StyledFlex>
        </SearchResultWrapperGridItem>
        <SearchResultWrapperGridItem>
          <Count>{result.lines.length}</Count>
        </SearchResultWrapperGridItem>
      </SearchResultWrapperGrid>
      <ResultContainer>
        {expanded &&
          result.lines.slice(0, resultsToShow).map((line, index) => (
            <ResultText key={index}>
              <ResultTextWrapper>
                <Text>
                  {/* {line} */}
                  {line.length > 35 ? `${line.substring(0, 35)}...` : line}
                </Text>
                <ResultButtonWrapper>
                  <ResultActionButton>
                    <VscClose />
                  </ResultActionButton>
                  <ResultActionButton>
                    <VscReplaceAll />
                  </ResultActionButton>
                </ResultButtonWrapper>
              </ResultTextWrapper>
            </ResultText>
          ))}
        {showMoreButtonVisible && (
          <>
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setResultsToShow(resultsToShow + 10);
              }}
            >
              show more
            </button>
            <span>
              {result.lines.length -
                result.lines.slice(0, resultsToShow).length}{" "}
              more
            </span>
          </>
        )}
      </ResultContainer>
    </ResultWrapper>
  );
};

export default Result;
