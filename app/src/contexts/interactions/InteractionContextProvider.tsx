import { createContext, useState, FC } from "react";

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

const InteractionCTX = createContext<InteractionCTXInterface>(defaultState);

const InteractionContextProvider: FC<{
  children: JSX.Element | JSX.Element[];
}> = ({ children }) => {
  const [explorerInteractions, setExplorerInteractionsState] =
    useState<ExplorerInteractions>(defaultState.explorerInteractions);

  return (
    <InteractionCTX.Provider
      value={{ explorerInteractions, setExplorerInteractionsState }}
    >
      {children}
    </InteractionCTX.Provider>
  );
};

export default InteractionContextProvider;
