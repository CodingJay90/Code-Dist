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
import { useAppSelector } from "@/reduxStore/hooks";

const ExplorerNav = () => {
  const workspaceName = useAppSelector((state) => state.app.workspaceName);
  const { explorerInteractions, setExplorerInteractionsState } =
    useInteractionContext();
  return (
    <Wrapper>
      <StyledFlex>
        <StyledFlex justify="flex-start">
          <Arrow direction="right" />
          <WorkSpaceName>{workspaceName}</WorkSpaceName>
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
