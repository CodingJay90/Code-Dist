import { createContext, useState, FC } from "react";
import { createCtx } from "@/contexts/createCTXHelper";
import { IFile } from "@/graphql/models/app.interface";

interface ExplorerInteractions {
  isDirectoryState: boolean;
  collapseAllFolders: string;
  selectedFilePath: string;
  selectedFolderPath: string;
  explorerNavCreateFile: boolean;
  explorerNavCreateDirectory: boolean;
  reRenderFileTree: boolean;
}

interface EditorInteractions {
  fileToClose: IFile | null;
  showCloseFileDialogModal: boolean;
}

type ExplorerInteractionsUpdateType = React.Dispatch<
  React.SetStateAction<ExplorerInteractions>
>;
type EditorInteractionsUpdateType = React.Dispatch<
  React.SetStateAction<EditorInteractions>
>;
interface InteractionCTXInterface {
  explorerInteractions: ExplorerInteractions;
  editorInteractions: EditorInteractions;
  setExplorerInteractionsState: ExplorerInteractionsUpdateType;
  setEditorInteractionsState: EditorInteractionsUpdateType;
}

const defaultState: InteractionCTXInterface = {
  explorerInteractions: {
    isDirectoryState: true,
    collapseAllFolders: "",
    selectedFilePath: "",
    selectedFolderPath: "",
    explorerNavCreateFile: false,
    explorerNavCreateDirectory: false,
    reRenderFileTree: false,
  },
  editorInteractions: {
    fileToClose: null,
    showCloseFileDialogModal: false,
  },
  setExplorerInteractionsState: () => defaultState.explorerInteractions,
  setEditorInteractionsState: () => defaultState.explorerInteractions,
};

export const [useInteractionContext, InteractionContext] =
  createCtx<InteractionCTXInterface>();

const InteractionContextProvider: FC<{
  children: JSX.Element | JSX.Element[];
}> = ({ children }) => {
  const [explorerInteractions, setExplorerInteractionsState] =
    useState<ExplorerInteractions>(defaultState.explorerInteractions);
  const [editorInteractions, setEditorInteractionsState] =
    useState<EditorInteractions>(defaultState.editorInteractions);

  return (
    <InteractionContext
      value={{
        explorerInteractions,
        editorInteractions,
        setExplorerInteractionsState,
        setEditorInteractionsState,
      }}
    >
      {children}
    </InteractionContext>
  );
};

export default InteractionContextProvider;
