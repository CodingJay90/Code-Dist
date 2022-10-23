import { StyledContainer, StyledFlex } from "@/elements/Global";
import { Container, IconWrapper } from "./elements";
import { VscFiles, VscSearch } from "react-icons/vsc";
import { ExplorerView } from "@/components/models";

interface IProps {
  setExplorerView: React.Dispatch<React.SetStateAction<ExplorerView>>;
  explorerView: ExplorerView;
}
const ActivityBar = ({ setExplorerView, explorerView }: IProps) => {
  return (
    <Container>
      <StyledFlex direction="column">
        <IconWrapper
          active={explorerView === ExplorerView.EXPLORER}
          width="50%"
          onClick={() => setExplorerView(ExplorerView.EXPLORER)}
        >
          <VscFiles fill="#fff" size={24} />
        </IconWrapper>
        <IconWrapper
          active={explorerView === ExplorerView.SEARCH}
          width="50%"
          onClick={() => setExplorerView(ExplorerView.SEARCH)}
        >
          <VscSearch fill="#fff" size={24} />
        </IconWrapper>
      </StyledFlex>
    </Container>
  );
};

export default ActivityBar;
