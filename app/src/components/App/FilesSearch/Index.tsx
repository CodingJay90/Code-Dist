import { useState, useMemo } from "react";
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
  ResultContainer,
  ResultText,
  ResultButtonWrapper,
  ResultActionButton,
} from "./elements";
import { useAppDispatch, useAppSelector } from "@/reduxStore/hooks";
import { IFile, IDirectory } from "@/graphql/models/app.interface";
import Result from "./Result";
import UseLocalStorage from "@/utils/storage";
import { updateDirectoryTree } from "@/reduxStore/app/appSlice";
import { useUpdateFileContent } from "@/graphql/mutations/app.mutations";
import CloseEditedFileModal from "@/components/Modal/CloseEditedFileModal/Index";
import ReplaceSearchModal from "@/components/Modal/ReplaceSearchModal/Index";

type SearchResults = { file: IFile; lines: string[] }[];
const getLocalStorage = UseLocalStorage.getInstance();

const FilesSearch = () => {
  const [searchHistoryIndex, setSearchHistoryIndex] = useState<number>(-1);
  const [searchHistory, setSearchHistory] = useState<string[]>(
    getLocalStorage.getSearchHistory()
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [regexError, setRegexError] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [replaceInput, setReplaceInput] = useState<string>("");
  const [filesToIncludeInput, setFilesToIncludeInput] = useState<string>("");
  const [filesToExcludeInput, setFilesToExcludeInput] = useState<string>("");
  const [matchCase, setMatchCase] = useState<boolean>(false);
  const [matchWholeWord, setMatchWholeWord] = useState<boolean>(false);
  const [useRegex, setUseRegex] = useState<boolean>(false);
  const [toggleReplace, setToggleReplace] = useState<boolean>(true);
  const [toggleSearchDetails, setToggleSearchDetails] = useState<boolean>(true);
  const [collapseAll, setCollapseAll] = useState<boolean>(false);
  const [showDialogModal, setShowDialogModal] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResults>([]);

  const { updateFileContent } = useUpdateFileContent();
  const { directoryTree } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const recursiveSearch = useMemo(() => {
    let allFiles: IFile[] = [];
    let recursive = (directories: IDirectory[]) =>
      directories.map(({ files, sub_directory }) => {
        allFiles = [...allFiles, ...files];
        if (sub_directory && sub_directory.length > 0) {
          recursive(sub_directory);
        }
      });
    recursive(directoryTree.directories);
    return allFiles;
  }, [directoryTree]);

  function matchWholeWordSearch(files: IFile[], query: string): IFile[] {
    const matchedFiles = files
      .map((i) => i.file_content)
      .map((i) => {
        let value = matchCase ? query : query.toLowerCase();
        if (value.length === 0) return;
        function isMatch(searchOnString: string, searchText: string) {
          searchText = searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
          return (
            searchOnString.match(new RegExp("\\b" + searchText + "\\b")) != null
          );
        }
        return isMatch(i.replace(/["']/g, ""), value);
      })
      .map((i, index) => {
        if (i === true) return files[index];
      })
      .filter((i) => i !== undefined) as IFile[] | [];
    return matchedFiles;
  }

  function caseSensitiveSearch(files: IFile[], query: string): IFile[] {
    const caseSensitiveMatches = files
      .map((i) => i.file_content)
      .map((x) => {
        return matchCase
          ? x.indexOf(query)
          : x.toLowerCase().indexOf(query.toLowerCase());
      })
      .map((item, index) => {
        let matched: IFile[] = [];
        if (item !== -1 && item !== undefined) matched.push(files[index]);
        return matched[0];
      })
      .filter((i) => i !== undefined);
    return caseSensitiveMatches;
  }

  function matchRegex(files: IFile[], query: string): IFile[] {
    try {
      const regex = files.filter((x) => x.file_content.search(query));
      return regex;
    } catch (error) {
      setRegexError("Invalid regular expression");
      return [];
    }
  }

  function searchFiles(query: string): IFile[] {
    const files = recursiveSearch;
    const filesToInclude = files
      .filter((file) => {
        const fileExtension = `.${file.file_type.toLowerCase()}`;
        const fileTypesToCheckFor = filesToIncludeInput
          .replace(/\s+/g, "")
          .toLowerCase()
          .split(",");
        return filesToIncludeInput.length > 0
          ? fileTypesToCheckFor.includes(fileExtension)
          : true;
      })
      .filter((file) => {
        const fileExtension = `.${file.file_type.toLowerCase()}`;
        const fileTypesToCheckFor = filesToExcludeInput
          .replace(/\s+/g, "")
          .toLowerCase()
          .split(",");

        return !fileTypesToCheckFor.includes(fileExtension);
      }); //filter all files by the files to include or exclude

    if (matchWholeWord) return matchWholeWordSearch(filesToInclude, query);
    if (matchCase) return caseSensitiveSearch(filesToInclude, query);
    if (useRegex) return matchRegex(filesToInclude, query);
    return filesToInclude.filter((file) => file.file_content.includes(query));
  }

  function updateSearchHistory(key: string): void {
    if (["ArrowUp", "ArrowDown"].includes(key)) {
      if (key === "ArrowUp") {
        searchHistoryIndex === searchHistory.length - 1
          ? setSearchHistoryIndex(0)
          : setSearchHistoryIndex(searchHistoryIndex + 1);
      }
      if (key === "ArrowDown") {
        searchHistoryIndex <= 0
          ? setSearchHistoryIndex(0)
          : setSearchHistoryIndex(searchHistoryIndex - 1);
      }
      const history = searchHistory[searchHistoryIndex] ?? "";
      setSearchKeyword(history);
    }
  }

  function onSearchFilesKeyup(
    event: React.KeyboardEvent<HTMLInputElement>
  ): void {
    const value = event.currentTarget.value;
    updateSearchHistory(event.key || event.code);
    setErrorMessage("");
    setRegexError("");
    const matchedFiles = searchFiles(value);
    const matchedLines: SearchResults = [];
    matchedFiles.forEach((file, index) => {
      const lines = file.file_content.split("\n");
      let match: string[] = [];
      lines.forEach((x: string) => {
        if (x.includes(value)) match.push(x);
      });
      matchedLines.push({ file: matchedFiles[index], lines: match });
    });
    setSearchResults(matchedLines);
    if (!matchedFiles.length && !regexError)
      setErrorMessage(
        "No results found. Review your match cases and check your keywords"
      );
  }

  function removeFileFromSearchResults(fileId: string): void {
    const updated = searchResults.filter((file) => file.file._id !== fileId);
    setSearchResults(updated);
  }

  function removeLineFromSearchResults(
    fileId: string,
    lineIndex: number
  ): void {
    const updatedLines =
      searchResults
        .find((file) => file.file._id === fileId)
        ?.lines.filter((i, index) => index !== lineIndex) ?? [];
    const updatedResult = searchResults.map((result) =>
      result.file._id === fileId ? { ...result, lines: updatedLines } : result
    );
    setSearchResults(updatedResult);
  }

  function updateLine(fileId: string, lineIndex: number): void {
    const file = searchResults.find((file) => file.file._id === fileId);
    if (!file) return;
    const fileSplits = file.file.file_content.split("\n");
    const updatedFileContent = fileSplits
      .map((i) =>
        i === file?.lines[lineIndex]
          ? i.replace(searchKeyword, replaceInput)
          : i
      )
      .join("\n");
    const updatedFile = {
      file: {
        ...file.file,
        file_content: updatedFileContent,
      },
      lines: file.lines.map((i, index) =>
        index === lineIndex ? i.replace(searchKeyword, replaceInput) : i
      ),
    };
    const updatedResult = searchResults.map((result) =>
      result.file._id === fileId ? updatedFile : result
    );
    dispatch(updateDirectoryTree(updatedFile.file));
    setSearchResults(updatedResult);
    updateFileContent({
      variables: {
        input: {
          _id: updatedFile.file._id,
          file_content: updatedFile.file.file_content,
        },
      },
    });
  }

  function updateAllMatches(): void {
    const matches = JSON.parse(JSON.stringify(searchResults)) as SearchResults;
    const updatedResult = matches.map((result) => {
      result.file.file_content = result.file.file_content.replaceAll(
        searchKeyword,
        replaceInput
      );
      result.lines = result.lines.map((i) =>
        i.replaceAll(searchKeyword, replaceInput)
      );
      return result;
    });
    const start = performance.now();
    updatedResult.map((result) => {
      dispatch(updateDirectoryTree(result.file));
      updateFileContent({
        variables: {
          input: {
            _id: result.file._id,
            file_content: result.file.file_content,
          },
        },
      });
    });
    const end = performance.now();
    console.log(`update took ${end - start} milliseconds.`);
    setSearchResults(updatedResult);
    setShowDialogModal(false);
  }

  function getSearchDetails(): string {
    const occurrences = searchResults
      .map((i) => i.lines.length)
      .reduce((a, b) => a + b, 0);
    const files = searchResults.length;
    const replaceWithKeyword = replaceInput;
    return `Replace ${occurrences} occurrences across ${files} files with '${replaceWithKeyword}'?`;
  }
  const disableNavButtonsAndReplaceButtons = searchKeyword.length < 1;
  return (
    <SearchContainer>
      <SearchNav>
        <StyledFlex>
          <SearchNavText>search</SearchNavText>
          <StyledFlex>
            <SearchNavButton disabled={disableNavButtonsAndReplaceButtons}>
              <VscRefresh />
            </SearchNavButton>
            <SearchNavButton
              disabled={disableNavButtonsAndReplaceButtons}
              onClick={() => setSearchResults([])}
            >
              <VscClearAll />
            </SearchNavButton>
            <SearchNavButton>
              <VscNewFile />
            </SearchNavButton>
            <SearchNavButton
              disabled={disableNavButtonsAndReplaceButtons}
              onClick={() => setCollapseAll(!collapseAll)}
            >
              <VscCollapseAll />
            </SearchNavButton>
          </StyledFlex>
        </StyledFlex>
      </SearchNav>
      <StyledFlex align="initial">
        <SearchInputsArrow>
          <Span
            title="Toggle replace"
            onClick={() => setToggleReplace(!toggleReplace)}
          >
            <Arrow direction={toggleReplace ? "right" : "down"} />
          </Span>
        </SearchInputsArrow>
        <SearchInputsContainer>
          <SearchInputWrapper>
            <SearchInput
              type="text"
              title="search"
              onKeyUp={onSearchFilesKeyup}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onBlur={() => getLocalStorage.setSearchHistory(searchKeyword)}
              value={searchKeyword}
              placeholder={`Search (${String.fromCharCode(
                8593
              )} ${String.fromCharCode(8595)} for history)`}
              autoComplete="off"
            />
            <SearchInputMatchersWrapper>
              <SearchInputMatchers
                active={matchCase}
                title="Match case"
                onClick={() => setMatchCase(!matchCase)}
              >
                <VscCaseSensitive size={20} />
              </SearchInputMatchers>
              <SearchInputMatchers
                active={matchWholeWord}
                onClick={() => setMatchWholeWord(!matchWholeWord)}
                title="Match whole Word"
              >
                ab
              </SearchInputMatchers>
              <SearchInputMatchers
                active={useRegex}
                onClick={() => setUseRegex(!useRegex)}
                title="Use Regular Expression"
              >
                <VscRegex size={20} />
              </SearchInputMatchers>
            </SearchInputMatchersWrapper>
          </SearchInputWrapper>
          {toggleReplace && (
            <SearchInputWrapper>
              <ReplaceInput
                type="text"
                title="replace"
                placeholder="Replace"
                autoComplete="off"
                onChange={(e) => setReplaceInput(e.target.value)}
              />
              <ReplaceButtonWrapper>
                <ReplaceButton
                  disabled={disableNavButtonsAndReplaceButtons}
                  onClick={() => setShowDialogModal(true)}
                >
                  <VscReplaceAll />
                </ReplaceButton>
                <ReplaceButton
                  onClick={() => setToggleSearchDetails(!toggleSearchDetails)}
                >
                  <VscEllipsis />
                </ReplaceButton>
              </ReplaceButtonWrapper>
            </SearchInputWrapper>
          )}
          {toggleSearchDetails && (
            <ToggledInputsContainer>
              <ToggledInputsWrapper>
                <Label htmlFor="to__include">files to include</Label>
                <ToggledInput
                  type="text"
                  id="to__include"
                  name="to__include"
                  placeholder="eg. *.ts, src/**/include"
                  spellCheck={false}
                  onChange={(e) => setFilesToIncludeInput(e.target.value)}
                />
              </ToggledInputsWrapper>

              <ToggledInputsWrapper>
                <Label htmlFor="to__exclude">files to exclude</Label>
                <ToggledInput
                  type="text"
                  id="to__exclude"
                  name="to__exclude"
                  placeholder="eg. *.ts, src/**/include"
                  spellCheck={false}
                  onChange={(e) => setFilesToExcludeInput(e.target.value)}
                />
              </ToggledInputsWrapper>
            </ToggledInputsContainer>
          )}
          <Message>
            {errorMessage} {regexError}
          </Message>
        </SearchInputsContainer>
      </StyledFlex>
      <SearchResultContainer width="100%">
        {searchResults.map((result) => (
          <Result
            key={result.file.file_id}
            result={result}
            searchQuery={searchKeyword}
            removeFileFromSearchResults={removeFileFromSearchResults}
            removeLineFromSearchResults={removeLineFromSearchResults}
            updateLine={updateLine}
            collapseAll={collapseAll}
          />
        ))}
      </SearchResultContainer>
      <ReplaceSearchModal
        showModal={showDialogModal}
        setShowModal={setShowDialogModal}
        onConfirm={updateAllMatches}
        message={getSearchDetails()}
        subMessage=""
      />
    </SearchContainer>
  );
};

export default FilesSearch;
