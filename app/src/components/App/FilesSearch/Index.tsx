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
import { useAppSelector } from "@/reduxStore/hooks";
import { IFile, IDirectory } from "@/graphql/models/app.interface";
import Result from "./Result";

type SearchResults = { file: IFile; lines: string[] }[];

const FilesSearch = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [regexError, setRegexError] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [replaceInput, setReplaceInput] = useState<string>("");
  const [filesToIncludeInput, setFilesToIncludeInput] = useState<string>("");
  const [filesToExcludeInput, setFilesToExcludeInput] = useState<string>("");
  const [matchCase, setMatchCase] = useState<boolean>(false);
  const [matchWholeWord, setMatchWholeWord] = useState<boolean>(false);
  const [useRegex, setUseRegex] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResults>([]);

  const { directoryTree } = useAppSelector((state) => state.app);

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

  function onSearchFilesKeyup(
    event: React.KeyboardEvent<HTMLInputElement>
  ): void {
    const value = event.currentTarget.value;
    setErrorMessage("");
    setRegexError("");
    setSearchKeyword(value);
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
    console.log(matchedLines);
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
            <SearchNavButton disabled={disableNavButtonsAndReplaceButtons}>
              <VscClearAll />
            </SearchNavButton>
            <SearchNavButton>
              <VscNewFile />
            </SearchNavButton>
            <SearchNavButton disabled={disableNavButtonsAndReplaceButtons}>
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
              onKeyUp={onSearchFilesKeyup}
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
          <SearchInputWrapper>
            <ReplaceInput
              type="text"
              title="replace"
              placeholder="Replace"
              autoComplete="off"
            />
            <ReplaceButtonWrapper>
              <ReplaceButton disabled={disableNavButtonsAndReplaceButtons}>
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
          <Message>
            {errorMessage} {regexError}
          </Message>
        </SearchInputsContainer>
      </StyledFlex>
      <SearchResultContainer width="100%">
        {searchResults.map((result) => (
          <Result result={result} searchQuery={searchKeyword} />
        ))}
      </SearchResultContainer>
    </SearchContainer>
  );
};

export default FilesSearch;
