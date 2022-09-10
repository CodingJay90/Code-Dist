import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/reduxStore/store";
import { IDirectory, IFile } from "@/graphql/models/app.interface";
import UseLocalStorage from "@/utils/storage";

interface IFileView extends IFile {
  isModified?: boolean;
}

// Define a type for the slice state
interface AppState {
  directoryTree: IDirectory[];
  openedFiles: IFileView[];
  selectedFile: IFileView | null;
  activeOpenedFile: IFileView | null;
  workspaceName: string;
}

const getLocalStorage = UseLocalStorage.getInstance();

const initialState: AppState = {
  directoryTree: [],
  openedFiles: getLocalStorage.getOpenedFiles(),
  activeOpenedFile: getLocalStorage.getActiveOpenedFile(),
  selectedFile: null,
  workspaceName: "",
};

export const app = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateDirectoryTree: (state, action: PayloadAction<IDirectory[]>) => {
      state.directoryTree = action.payload;
    },
    addToOpenedFiles: (state, action: PayloadAction<IFileView>) => {
      const fileExist = state.openedFiles.find(
        (i) => i._id === action.payload._id
      );
      if (fileExist) return;
      const newOpenedFilesState = [...state.openedFiles, action.payload];
      getLocalStorage.setOpenedFiles(newOpenedFilesState);
      state.openedFiles = newOpenedFilesState;
    },
    removeFileFromOpenedFiles: (state, action: PayloadAction<string>) => {
      const newState = state.openedFiles.filter(
        (i) => i._id === action.payload
      );
      getLocalStorage.setOpenedFiles(newState);
      state.openedFiles = newState;
    },
    setActiveOpenedFile: (state, action: PayloadAction<IFileView>) => {
      const newActiveOpenedFileState = {
        ...state.activeOpenedFile,
        ...action.payload,
      };
      getLocalStorage.setActiveOpenedFile(newActiveOpenedFileState);
      state.activeOpenedFile = newActiveOpenedFileState;
    },
    toggleFileModifiedStatus: (
      state,
      action: PayloadAction<{ fileId: string; status: boolean }>
    ) => {
      const fileToUpdate = state.openedFiles.find(
        (file) => file._id === action.payload.fileId
      );
      if (!fileToUpdate) return;
      fileToUpdate.isModified = action.payload.status;
      const updatedOpenedFiles = state.openedFiles.map((file) =>
        file._id === action.payload.fileId ? fileToUpdate : file
      );
      getLocalStorage.setOpenedFiles(updatedOpenedFiles);
      getLocalStorage.setActiveOpenedFile(fileToUpdate);
      state.openedFiles = updatedOpenedFiles;
      state.activeOpenedFile = fileToUpdate;
    },
    setWorkspaceName: (state, action: PayloadAction<string>) => {
      state.workspaceName = action.payload;
    },
  },
});

export const {
  updateDirectoryTree,
  addToOpenedFiles,
  setActiveOpenedFile,
  setWorkspaceName,
  toggleFileModifiedStatus,
} = app.actions;

export const selectCount = (state: RootState) => state.app;

export default app.reducer;
