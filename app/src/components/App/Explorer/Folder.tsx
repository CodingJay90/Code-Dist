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
import { useDeleteDirectory } from "@/graphql/mutations/app.mutations";
import { ActionType } from "@/components/App/types";

interface IProps {
  folder: IDirectory;
  children: JSX.Element;
  nested: boolean;
}

const Folder = ({ folder, children, nested }: IProps): JSX.Element => {
  const [showSubFolders, setShowSubFolders] = useState<boolean>(false);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [showTextField, setShowTextField] = useState<boolean>(false);
  const [actionType, setActionType] = useState<ActionType>("create");
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const { deleteDirectory } = useDeleteDirectory(
    folder._id ?? folder.directory_id
  );

  function renderTextField(actionType: ActionType): void {
    setActionType(actionType);
    setShowTextField(true);
    setShowSubFolders(true);
  }

  const menuItems = [
    [
      {
        shortcut: "",
        label: "new folder",
        onClick: () => renderTextField("create"),
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
        onClick: () => renderTextField("rename"),
      },
      {
        shortcut: "",
        label: "delete",
        onClick: () => deleteDirectory(),
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
    <FolderBlock key={folder.directory_id} nested={nested} id={folder._id}>
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
        directoryId={folder._id ?? folder.directory_id}
        defaultValue={folder.directory_name}
        actionType={actionType}
        isDirectory={true}
      />
      {showSubFolders && (
        <NestedFolder className="nest">{children}</NestedFolder>
      )}
    </FolderBlock>
  );
};

export default Folder;
