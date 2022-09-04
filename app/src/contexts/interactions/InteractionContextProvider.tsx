import { createContext, useState, FC } from "react";
import { createCtx } from "@/contexts/createCTXHelper";
interface ExplorerInteractions {
  isDirectoryState: boolean;
  selectedFileId: string;
  selectedFolderId: string;
}

interface InteractionCTXInterface {
  explorerInteractions: ExplorerInteractions;
  setExplorerInteractionsState?: React.Dispatch<
    React.SetStateAction<ExplorerInteractions>
  >;
}

const defaultState: InteractionCTXInterface = {
  explorerInteractions: {
    isDirectoryState: true,
    selectedFileId: "",
    selectedFolderId: "",
  },
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
