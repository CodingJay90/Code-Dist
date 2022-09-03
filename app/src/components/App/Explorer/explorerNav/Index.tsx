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

const ExplorerNav = () => {
  return (
    <Wrapper>
      <StyledFlex>
        <StyledFlex justify="flex-start">
          <Arrow direction="right" />
          <WorkSpaceName>Test Dev</WorkSpaceName>
        </StyledFlex>
        <NavButtonList>
          <NavButtonListItem onClick={() => alert("yay")}>
            <VscNewFile />
          </NavButtonListItem>
          <NavButtonListItem>
            <VscNewFolder />
          </NavButtonListItem>
          <NavButtonListItem>
            <VscRefresh />
          </NavButtonListItem>
          <NavButtonListItem>
            <VscCollapseAll />
          </NavButtonListItem>
        </NavButtonList>
      </StyledFlex>
    </Wrapper>
  );
};

export default ExplorerNav;
