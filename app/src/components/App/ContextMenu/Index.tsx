import { StyledContainer } from "@/elements/Global";
import {
  ContextList,
  ContextListItem,
  ContextListItemWrapper,
  HR,
  Wrapper,
} from "./elements";
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
  // TBD: move conditional to be outside component
  if (showContext === false) return null;
  const contextRef = useOnClickOutside(onClickOutside);
  return (
    <Wrapper ref={contextRef} x={contextPosition.x} y={contextPosition.y}>
      <StyledContainer width="100%">
        {menuItems.map((i, index) => (
          <>
            <ContextList key={index}>
              {i.map((item, ind) => (
                <ContextListItem
                  key={ind}
                  onClick={() => {
                    setShowContext(false);
                    item.onClick();
                  }}
                >
                  {item.label}
                </ContextListItem>
              ))}
            </ContextList>
            {menuItems.length - index !== index && <HR />}
          </>
        ))}
      </StyledContainer>
    </Wrapper>
  );
};

export default ContextMenu;
