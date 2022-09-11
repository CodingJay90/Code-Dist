import { ChangeEvent, MouseEvent, useRef, useState } from "react";
import ContextMenu from "@/components/App/ContextMenu/Index";
import {
  Brand,
  DirName,
  FileName,
  InfoContainer,
  MenuBarButton,
  MenuBarButtonContainer,
  MenuBarContainer,
  MenuBarGroup,
  Status,
  UploadInput,
  ViewContainer,
} from "./elements";
import { useUploadDirectory } from "@/graphql/mutations/app.mutations";
import { useInteractionContext } from "@/contexts/interactions/InteractionContextProvider";
import { useAppSelector } from "@/reduxStore/hooks";

const MenuBar = () => {
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const { uploadDirectory } = useUploadDirectory();
  const { workspaceName, activeOpenedFile } = useAppSelector(
    (state) => state.app
  );
  const { explorerInteractions, setExplorerInteractionsState } =
    useInteractionContext();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const menuItems = [
    [
      {
        shortcut: "",
        label: "new text file",
        onClick: () => alert("only open folder works currently"),
      },
      {
        shortcut: "",
        label: "new file... ",
        onClick: () => alert("only open folder works currently"),
      },
      {
        shortcut: "",
        label: "new window",
        onClick: () => alert("only open folder works currently"),
      },
    ],
    [
      {
        shortcut: "",
        label: "open file",
        onClick: () => alert("only open folder works currently"),
      },
      {
        shortcut: "",
        label: "open folder(zip)",
        onClick: () => inputRef?.current && inputRef?.current.click(),
      },
    ],
  ];

  function onFileMenuClick(e: MouseEvent<HTMLButtonElement>): void {
    setCursorPosition({ x: e.pageX, y: e.pageY + 15 });
    setShowContextMenu(true);
  }

  const onFileChange = ({
    target: {
      validity,
      files: [file],
    },
  }: any) => {
    validity.valid && uploadDirectory({ variables: { file } });
    setExplorerInteractionsState({
      ...explorerInteractions,
      reRenderFileTree: true,
    });
  };

  return (
    <MenuBarContainer>
      <MenuBarGroup>
        <MenuBarButtonContainer>
          <MenuBarButton onClick={onFileMenuClick}>file</MenuBarButton>
          <MenuBarButton>edit</MenuBarButton>
          <MenuBarButton>selection</MenuBarButton>
          <MenuBarButton>view</MenuBarButton>
          <UploadInput
            type="file"
            ref={inputRef}
            accept="application/zip"
            onChange={onFileChange}
          />
        </MenuBarButtonContainer>
      </MenuBarGroup>

      <InfoContainer justify="center">
        {activeOpenedFile && (
          <>
            {activeOpenedFile.isModified === true && <Status />}
            <FileName>{activeOpenedFile?.file_name} -</FileName>
          </>
        )}
        <DirName>{workspaceName} -</DirName>
        <Brand>Code dist</Brand>
      </InfoContainer>
      <ViewContainer></ViewContainer>

      <ContextMenu
        contextPosition={cursorPosition}
        showContext={showContextMenu}
        onClickOutside={() => setShowContextMenu(false)}
        setShowContext={setShowContextMenu}
        menuItems={menuItems}
      />
    </MenuBarContainer>
  );
};

export default MenuBar;
