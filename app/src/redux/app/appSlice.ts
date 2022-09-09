import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/reduxStore/store";
import { IDirectory, IFile } from "@/graphql/models/app.interface";

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

const initialState: AppState = {
  directoryTree: [],
  openedFiles: [],
  selectedFile: null,
  activeOpenedFile: null,
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
      state.openedFiles.push(action.payload);
    },
    removeFileFromOpenedFiles: (state, action: PayloadAction<string>) => {
      const newState = state.openedFiles.filter(
        (i) => i._id === action.payload
      );
      state.openedFiles = newState;
    },
    setActiveOpenedFile: (state, action: PayloadAction<IFileView>) => {
      state.activeOpenedFile = { ...state.activeOpenedFile, ...action.payload };
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
      state.openedFiles = updatedOpenedFiles;
      state.activeOpenedFile = fileToUpdate;
      // state.activeOpenedFile = action.payload;
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
