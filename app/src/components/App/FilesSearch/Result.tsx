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
  VscReplace,
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
import { useAppDispatch } from "@/reduxStore/hooks";
import {
  addToOpenedFiles,
  setActiveOpenedFile,
} from "@/reduxStore/app/appSlice";

interface IProps {
  result: { file: IFile; lines: string[] };
  searchQuery: string;
  collapseAll: boolean;
  removeFileFromSearchResults: (id: string) => void;
  removeLineFromSearchResults: (id: string, index: number) => void;
  updateLine: (id: string, index: number) => void;
}

const Result = ({
  result,
  searchQuery,
  removeFileFromSearchResults,
  removeLineFromSearchResults,
  updateLine,
  collapseAll,
}: IProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [resultsToShow, setResultsToShow] = useState<number>(10);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (resultsToShow > 10 && !expanded) setResultsToShow(10); //resets the amount of elements rendered in the dom back to 10 to prevent having too much nodes sitting around in the dom
  }, [expanded]);

  useEffect(() => {
    setExpanded(false);
  }, [collapseAll]);

  const showMoreButtonVisible =
    expanded &&
    result.lines.length > 10 &&
    result.lines.length >= resultsToShow;

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
          <Count
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              removeFileFromSearchResults(result.file._id);
            }}
          >
            {result.lines.length}
          </Count>
        </SearchResultWrapperGridItem>
      </SearchResultWrapperGrid>
      <ResultContainer>
        {expanded &&
          result.lines.slice(0, resultsToShow).map((line, index) => (
            <ResultText
              key={index}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                dispatch(setActiveOpenedFile(result.file));
                dispatch(addToOpenedFiles(result.file));
              }}
            >
              <ResultTextWrapper>
                <Text>
                  {/* {line} */}
                  {line.length > 35 ? `${line.substring(0, 35)}...` : line}
                </Text>
                <ResultButtonWrapper>
                  <ResultActionButton
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      removeLineFromSearchResults(result.file._id, index);
                    }}
                  >
                    <VscClose />
                  </ResultActionButton>
                  <ResultActionButton
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      updateLine(result.file._id, index);
                    }}
                  >
                    <VscReplace />
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
