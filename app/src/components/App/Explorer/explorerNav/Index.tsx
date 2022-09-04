import Arrow from "@/components/Icons/Arrow";
import { StyledFlex } from "@/elements/Global";
import {
  NavButton,
  NavButtonList,
  NavButtonListItem,
  WorkSpaceName,
  Wrapper,
} from "./elements";
import {
  VscNewFile,
  VscNewFolder,
  VscRefresh,
  VscCollapseAll,
} from "react-icons/vsc";
import { useInteractionContext } from "@/contexts/interactions/InteractionContextProvider";

const ExplorerNav = () => {
  const { explorerInteractions, setExplorerInteractionsState } =
    useInteractionContext();
  function handleAddFolderButtonClick() {}
  return (
    <Wrapper>
      <StyledFlex>
        <StyledFlex justify="flex-start">
          <Arrow direction="right" />
          <WorkSpaceName>Test Dev</WorkSpaceName>
        </StyledFlex>
        <NavButtonList>
          <NavButtonListItem
            onClick={() =>
              setExplorerInteractionsState({
                ...explorerInteractions,
                explorerNavCreateFile: true,
              })
            }
          >
            <VscNewFile />
          </NavButtonListItem>
          <NavButtonListItem
            onClick={() =>
              setExplorerInteractionsState({
                ...explorerInteractions,
                explorerNavCreateDirectory: true,
              })
            }
          >
            <VscNewFolder />
          </NavButtonListItem>
          <NavButtonListItem>
            <VscRefresh />
          </NavButtonListItem>
          <NavButtonListItem
            onClick={() => {
              setExplorerInteractionsState({
                ...explorerInteractions,
                collapseAllFolders: Math.random().toString(),
              });
            }}
          >
            <VscCollapseAll />
          </NavButtonListItem>
        </NavButtonList>
      </StyledFlex>
    </Wrapper>
  );
};

export default ExplorerNav;
