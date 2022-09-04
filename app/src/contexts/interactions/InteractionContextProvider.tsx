import { createContext, useState, FC } from "react";
import { createCtx } from "@/contexts/createCTXHelper";

interface ExplorerInteractions {
  isDirectoryState: boolean;
  collapseAllFolders: string;
  selectedFilePath: string;
  selectedFolderPath: string;
  explorerNavCreateFile: boolean;
  explorerNavCreateDirectory: boolean;
}

type UpdateType = React.Dispatch<React.SetStateAction<ExplorerInteractions>>;
interface InteractionCTXInterface {
  explorerInteractions: ExplorerInteractions;
  setExplorerInteractionsState: UpdateType;
}

const defaultState: InteractionCTXInterface = {
  explorerInteractions: {
    isDirectoryState: true,
    collapseAllFolders: "",
    selectedFilePath: "",
    selectedFolderPath: "",
    explorerNavCreateFile: false,
    explorerNavCreateDirectory: false,
  },
  setExplorerInteractionsState: () => defaultState.explorerInteractions,
};

export const [useInteractionContext, InteractionContext] =
  createCtx<InteractionCTXInterface>();

const InteractionContextProvider: FC<{
  children: JSX.Element | JSX.Element[];
}> = ({ children }) => {
  const [explorerInteractions, setExplorerInteractionsState] =
    useState<ExplorerInteractions>(defaultState.explorerInteractions);

  return (
    <InteractionContext
      value={{ explorerInteractions, setExplorerInteractionsState }}
    >
      {children}
    </InteractionContext>
  );
};

export default InteractionContextProvider;
