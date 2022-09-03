import { StyledContainer } from "@/elements/Global";
import { ContextList, ContextListItem, Wrapper } from "./elements";
import useOnClickOutside from "@/hooks/useOnclickOutside";

type MenuItem = {
  shortcut: string;
  label: string;
  onClick: () => void;
};

interface IProps {
  contextPosition: {
    x: number;
    y: number;
  };
  showContext: boolean;
  setShowContext: React.Dispatch<React.SetStateAction<boolean>>;
  onClickOutside: () => void;
  menuItems: MenuItem[][];
}

const ContextMenu = ({
  contextPosition,
  showContext,
  setShowContext,
  menuItems,
  onClickOutside,
}: IProps): JSX.Element | null => {
  const contextRef = useOnClickOutside(onClickOutside);
  if (!showContext) return null;
  return (
    <Wrapper ref={contextRef} x={contextPosition.x} y={contextPosition.y}>
      <StyledContainer width="100%">
        {menuItems.map((i) => (
          <ContextList>
            {i.map((item) => (
              <ContextListItem
                onClick={() => {
                  setShowContext(false);
                  item.onClick();
                }}
              >
                {item.label}
              </ContextListItem>
            ))}
          </ContextList>
        ))}
      </StyledContainer>
    </Wrapper>
  );
};

export default ContextMenu;
