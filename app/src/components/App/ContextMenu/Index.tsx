import { StyledContainer } from "@/elements/Global";
import { ContextList, ContextListItem, Wrapper } from "./elements";
import useOnClickOutside from "@/hooks/useOnclickOutside";

interface IProps {
  contextPosition: {
    x: number;
    y: number;
  };
  showContext: boolean;
  setShowContext: () => void;
  menuItems: [
    {
      shortcut: string;
      label: string;
      onClick: () => void;
    }[]
  ];
}

const ContextMenu = ({
  contextPosition,
  showContext,
  setShowContext,
  menuItems,
}: IProps): JSX.Element | null => {
  const contextRef = useOnClickOutside(setShowContext);
  if (!showContext) return null;
  return (
    <Wrapper ref={contextRef} x={contextPosition.x} y={contextPosition.y}>
      <StyledContainer width="100%">
        {menuItems.map((i) => (
          <ContextList>
            {i.map((item) => (
              <ContextListItem onClick={item.onClick}>
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
