import { StyledFlex } from "@/elements/Global";
import { IDirectory, IFile } from "@/graphql/models/app.interface";
import { useState, useEffect } from "react";
import ContextMenu from "@/components/App/ContextMenu/Index";
import {
  FolderArrowIcon,
  FolderBlock,
  FolderDragWrapper,
  FolderDropWrapper,
  FolderIcon,
  FolderName,
  FolderWrapper,
  NestedFolder,
} from "./elements";
import TextField from "@/components/App/TextField/Index";
import {
  useDeleteDirectory,
  useMoveDirectory,
  useMoveFile,
} from "@/graphql/mutations/app.mutations";
import { ActionType } from "@/components/App/types";
import { useInteractionContext } from "@/contexts/interactions/InteractionContextProvider";
import { useDrag, useDrop } from "react-dnd";
import { useAppDispatch } from "@/reduxStore/hooks";
import {
  moveFile,
  moveFolder,
  updateDirectoryTree,
} from "@/reduxStore/app/appSlice";
import { removeTrailingSlash } from "@/utils/string";

interface IProps {
  folder: IDirectory;
  children: JSX.Element;
  nested: boolean;
}

const Folder = ({ folder, children, nested }: IProps): JSX.Element => {
  const { explorerInteractions, setExplorerInteractionsState } =
    useInteractionContext();
  const [showSubFolders, setShowSubFolders] = useState<boolean>(false);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [showTextField, setShowTextField] = useState<boolean>(false);
  const [actionType, setActionType] = useState<ActionType>("create");
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [isDirectory, setIsDirectory] = useState<boolean>(true);
  const [folderIdToDrop, setFolderIdToDrop] = useState<string>("");
  const [fileIdToDrop, setFileIdToDrop] = useState<any>("");
  const dispatch = useAppDispatch();

  const [{ isDragged }, directoryDrag] = useDrag(() => ({
    type: "directory",
    item: folder,
    collect: (monitor) => ({
      isDragged: monitor.isDragging(),
      item: monitor.getItem(),
    }),
  }));

  const [{ directoryHover, directoryItemDrop }, directoryDrop] = useDrop(
    () => ({
      accept: "directory",
      drop: onDropFolder,
      collect: (monitor) => ({
        directoryHover: monitor.isOver(),
        directoryItemDrop: monitor.getItem(),
      }),
    })
  );

  const [{ isOver, item }, drop] = useDrop(() => ({
    accept: "file",
    drop: onDropFile,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      item: monitor.getItem(),
    }),
  }));

  const { deleteDirectory } = useDeleteDirectory(
    folder._id ?? folder.directory_id
  );

  const { moveFileMutation } = useMoveFile({
    destination_path: folder.directory_path,
    file_id: (item as IFile)?.file_id ?? "",
  });

  const { moveDirectoryMutation } = useMoveDirectory();

  useEffect(() => {
    setFileIdToDrop(item);
    if (isOver || directoryHover) setShowSubFolders(true);
  }, [isOver, directoryHover]);

  useEffect(() => {
    setShowSubFolders(false);
  }, [explorerInteractions.collapseAllFolders]);

  useEffect(() => {
    if (
      explorerInteractions.selectedFolderPath === folder.directory_path ||
      (explorerInteractions.selectedFolderPath === folder.directory_path &&
        explorerInteractions.explorerNavCreateDirectory === true)
    ) {
      setShowTextField(explorerInteractions.explorerNavCreateDirectory);
      setShowSubFolders(true);
    }
  }, [explorerInteractions.explorerNavCreateDirectory]);

  function renderTextField(
    actionType: ActionType,
    isDirectorySelected = true
  ): void {
    setActionType(actionType);
    setShowTextField(true);
    setShowSubFolders(true);
    setIsDirectory(isDirectorySelected); //this is to trigger createFile function from textfield
  }

  function validateDroppedItem(droppedItem: IDirectory): boolean {
    let droppedItemPathToSplit: string | string[] =
      droppedItem.directory_path.split("/");
    droppedItemPathToSplit.splice(droppedItemPathToSplit.length - 2, 2);
    droppedItemPathToSplit = `${droppedItemPathToSplit.join("/")}/`;
    const isSameDirectoryDropped =
      folder.directory_path === droppedItem.directory_path;
    if (isSameDirectoryDropped) return false; //return if folder is dropped into the same directory
    if (
      !isSameDirectoryDropped &&
      folder.directory_path === droppedItemPathToSplit
    )
      return false; // return if folder is dropped in the same directory the moved folder is sitting at
    if (
      removeTrailingSlash(droppedItem.directory_path).split("/").join("/") ===
      folder.directory_path
        .split("/")
        .splice(
          0,
          removeTrailingSlash(droppedItem.directory_path).split("/").length
        )
        .join("/")
    ) {
      console.log("okay");
      return false;
    } //return if folder dragged is dropped in it's sub_directory
    return true;
  }

  function onDropFolder(droppedItem: IDirectory): void {
    if (!validateDroppedItem(droppedItem)) return;
    setFolderIdToDrop(droppedItem.directory_id);
    moveDirectoryMutation({
      variables: {
        input: {
          destination_path: folder.directory_path,
          from_id: droppedItem._id,
        },
      },
    });
    console.log(folderIdToDrop);
    console.log(droppedItem.directory_id);
    dispatch(moveFolder({ prevDirectory: folder, newDirectory: droppedItem }));
  }

  function onDropFile(droppedItem: IFile) {
    moveFileMutation();
    // console.log("dropped", droppedItem);
    dispatch(moveFile({ file: droppedItem, directory: folder }));
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
        onClick: () => renderTextField("create", false),
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
    setExplorerInteractionsState({
      ...explorerInteractions,
      selectedFilePath: "",
      selectedFolderPath: folder.directory_path,
      isDirectoryState: true,
    });
  }

  return (
    <FolderBlock
      key={folder.directory_id}
      nested={nested}
      isHovered={isOver || directoryHover}
    >
      <FolderDragWrapper ref={directoryDrag} isDragged={isDragged}>
        <FolderDropWrapper ref={directoryDrop}>
          <FolderWrapper
            justify="flex-start"
            fileHovered={isOver}
            ref={drop}
            onMouseDown={onFolderClick}
          >
            <FolderArrowIcon direction={showSubFolders ? "down" : "right"} />
            <FolderIcon />
            <FolderName>{folder.directory_name}</FolderName>
          </FolderWrapper>
        </FolderDropWrapper>
      </FolderDragWrapper>

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
        isDirectory={isDirectory}
      />
      {showSubFolders && <NestedFolder>{children}</NestedFolder>}
    </FolderBlock>
  );
};

export default Folder;
