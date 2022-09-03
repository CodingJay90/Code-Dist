import { StyledFlex } from "@/elements/Global";
import { IDirectory } from "@/graphql/models/app.interface";
import { useState } from "react";
import ContextMenu from "@/components/App/ContextMenu/Index";
import {
  FolderArrowIcon,
  FolderBlock,
  FolderIcon,
  FolderName,
  FolderWrapper,
  NestedFolder,
} from "./elements";
import TextField from "@/components/App/TextField/Index";

interface IProps {
  folder: IDirectory;
  children: JSX.Element;
  nested: boolean;
}

const Folder = ({ folder, children, nested }: IProps): JSX.Element => {
  const [showSubFolders, setShowSubFolders] = useState<boolean>(false);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [showTextField, setShowTextField] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const menuItems = [
    [
      {
        shortcut: "",
        label: "new folder",
        onClick: () => {
          setShowTextField(true);
          setShowSubFolders(true);
        },
      },
      {
        shortcut: "",
        label: "new file",
        onClick: () => console.log("new file click"),
      },
    ],
    [
      {
        shortcut: "",
        label: "rename",
        onClick: () => console.log("rename click"),
      },
      {
        shortcut: "",
        label: "delete",
        onClick: () => console.log("delete click"),
      },
    ],
  ];

  function onFolderClick(e: React.MouseEvent<HTMLDivElement>): void {
    if (e.button === 0) {
      //left click
      setShowSubFolders(!showSubFolders);
    }
    if (e.button === 2) {
      setCursorPosition({
        x: e.pageX + 10,
        y: e.pageY + 10,
      });
      setShowContextMenu(true);
    }
  }

  return (
    <FolderBlock
      key={folder.directory_id}
      nested={nested}
      className="clickToCloseNested"
    >
      <FolderWrapper justify="flex-start" onMouseDown={onFolderClick}>
        <FolderArrowIcon direction={showSubFolders ? "down" : "right"} />
        <FolderIcon />
        <FolderName>{folder.directory_name}</FolderName>
      </FolderWrapper>

      <ContextMenu
        contextPosition={cursorPosition}
        showContext={showContextMenu}
        onClickOutside={() => setShowContextMenu(false)}
        setShowContext={setShowContextMenu}
        menuItems={menuItems}
      />
      <TextField
        showTextField={showTextField}
        setShowTextField={setShowTextField}
        directoryPath={folder.directory_path}
      />
      {showSubFolders && (
        <NestedFolder className="nest">{children}</NestedFolder>
      )}
    </FolderBlock>
  );
};

export default Folder;
