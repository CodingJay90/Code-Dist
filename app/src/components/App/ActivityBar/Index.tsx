import { StyledContainer, StyledFlex } from "@/elements/Global";
import { Container, IconWrapper } from "./elements";
import { VscFiles, VscSearch } from "react-icons/vsc";
import { ExplorerView } from "@/components/models";

interface IProps {
  setExplorerView: React.Dispatch<React.SetStateAction<ExplorerView>>;
  explorerView: ExplorerView;
}
const ActivityBar = ({ setExplorerView }: IProps) => {
  return (
    <Container>
      <StyledFlex direction="column">
        <IconWrapper
          width="50%"
          onClick={() => setExplorerView(ExplorerView.EXPLORER)}
        >
          <VscFiles size={24} />
        </IconWrapper>
        <IconWrapper
          width="50%"
          onClick={() => setExplorerView(ExplorerView.SEARCH)}
        >
          <VscSearch size={24} />
        </IconWrapper>
      </StyledFlex>
    </Container>
  );
};

export default ActivityBar;
