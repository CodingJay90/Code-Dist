import { IFile } from "@/graphql/models/app.interface";
import { useState, useEffect } from "react";
import { FcFile } from "react-icons/fc";
import { useDrag } from "react-dnd";
import { FileContainer, FileIcon, FileName, FileWrapper } from "./elements";
import ContextMenu from "@/components/App/ContextMenu/Index";
import { ActionType } from "@/components/App/types";
import { useDeleteFile } from "@/graphql/mutations/app.mutations";
import TextField from "@/components/App/TextField/Index";
import { useInteractionContext } from "@/contexts/interactions/InteractionContextProvider";
import { useAppDispatch } from "@/reduxStore/hooks";
import {
  addToOpenedFiles,
  deleteDirectoryOrFileAction,
  setActiveOpenedFile,
} from "@/reduxStore/app/appSlice";
import UseLocalStorage from "@/utils/storage";
interface IProps {
  file: IFile;
  directoryPath: string;
  directoryId: string;
}

const getLocalStorage = UseLocalStorage.getInstance();
const File = ({ file, directoryPath, directoryId }: IProps) => {
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [showTextField, setShowTextField] = useState<boolean>(false);
  const [actionType, setActionType] = useState<ActionType>("create");
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const dispatch = useAppDispatch();
  const { explorerInteractions, setExplorerInteractionsState } =
    useInteractionContext();

  const { deleteFile } = useDeleteFile(file._id);
  const [{ isDragged }, drag, dragPreview] = useDrag(() => ({
    type: "file",
    item: file,
    collect: (monitor) => ({
      isDragged: monitor.isDragging(),
      item: monitor.getItem(),
    }),
  }));

  // console.log(collected);

  useEffect(() => {
    if (
      explorerInteractions.selectedFilePath === file.file_dir ||
      (explorerInteractions.selectedFolderPath === directoryPath &&
        explorerInteractions.explorerNavCreateFile === true)
    ) {
      setShowTextField(explorerInteractions.explorerNavCreateFile);
    }
  }, [explorerInteractions.explorerNavCreateFile]);

  function renderTextField(actionType: ActionType): void {
    setActionType(actionType);
    setShowTextField(true);
  }

  const menuItems = [
    [
      {
        shortcut: "",
        label: "rename file",
        onClick: () => renderTextField("rename"),
      },
      {
        shortcut: "",
        label: "add file to current directory",
        onClick: () => renderTextField("create"),
      },
    ],
    [
      {
        shortcut: "",
        label: "delete",
        onClick: () => {
          deleteFile();
          dispatch(deleteDirectoryOrFileAction({ fileId: file._id }));
        },
      },
      {
        shortcut: "",
        label: "cut",
        onClick: () => alert(""),
      },
    ],
  ];

  function onFileClick(e: React.MouseEvent<HTMLDivElement>): void {
    if (e.button === 0) {
      //left click
      dispatch(setActiveOpenedFile(file));
      dispatch(addToOpenedFiles(file));
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
      selectedFolderPath: "",
      selectedFilePath: file.file_dir,
      isDirectoryState: false,
    });
  }

  return (
    <FileContainer nested={true}>
      <FileWrapper
        justify="flex-start"
        isDragged={isDragged}
        ref={drag}
        onMouseUp={onFileClick}
        title={file.file_dir}
      >
        <FileIcon>
          <FcFile />
        </FileIcon>
        <FileName>{file.file_name}</FileName>
      </FileWrapper>

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
        directoryPath={directoryPath}
        directoryId={directoryId}
        defaultValue={file.file_name}
        actionType={actionType}
        isDirectory={false}
        fileId={file._id}
      />
    </FileContainer>
  );
};

export default File;
