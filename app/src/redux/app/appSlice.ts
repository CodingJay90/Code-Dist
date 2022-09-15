import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/reduxStore/store";
import { IDirectory, IFile } from "@/graphql/models/app.interface";
import UseLocalStorage from "@/utils/storage";

interface DirectoryTree {
  directories: IDirectory[];
  root_dir_files: IFile[];
}

interface AppState {
  directoryTree: DirectoryTree;
  openedFiles: IFile[];
  selectedFile: IFile | null;
  activeOpenedFile: IFile | null;
  workspaceName: string;
}

const getLocalStorage = UseLocalStorage.getInstance();
const initialState: AppState = {
  directoryTree: { directories: [], root_dir_files: [] },
  openedFiles: getLocalStorage.getOpenedFiles(),
  activeOpenedFile: getLocalStorage.getActiveOpenedFile(),
  selectedFile: null,
  workspaceName: "",
};

export const app = createSlice({
  name: "app",
  initialState,
  reducers: {
    setDirectoryTree: (state, action: PayloadAction<DirectoryTree>) => {
      state.directoryTree = action.payload;
    },
    addToOpenedFiles: (state, action: PayloadAction<IFile>) => {
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
        (i) => i._id !== action.payload
      );
      const openedFiles = current(state.openedFiles);
      const lastFileOnOpenedFiles = openedFiles[openedFiles.length - 1];
      if (openedFiles.length !== 1) {
        console.log("run here");
        state.activeOpenedFile = lastFileOnOpenedFiles;
        getLocalStorage.setActiveOpenedFile(lastFileOnOpenedFiles);
      } else {
        state.activeOpenedFile = null;
        getLocalStorage.setActiveOpenedFile(null);
      }
      getLocalStorage.setOpenedFiles(newState);
      state.openedFiles = newState;
    },
    setActiveOpenedFile: (state, action: PayloadAction<IFile>) => {
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
    updateFile: (
      state,
      action: PayloadAction<{ fileToUpdate: IFile; status: boolean }>
    ) => {
      const fileToUpdate = JSON.parse(
        JSON.stringify(action.payload.fileToUpdate)
      ) as IFile;
      fileToUpdate.isModified = action.payload.status;
      const updatedOpenedFiles = state.openedFiles.map((file) =>
        file._id === fileToUpdate._id ? fileToUpdate : file
      );
      getLocalStorage.setOpenedFiles(updatedOpenedFiles);
      getLocalStorage.setActiveOpenedFile(fileToUpdate);
      state.openedFiles = updatedOpenedFiles;
      state.activeOpenedFile = fileToUpdate;
    },
    setWorkspaceName: (state, action: PayloadAction<string>) => {
      state.workspaceName = action.payload;
    },
    updateDirectoryTree: (state, action: PayloadAction<IFile>) => {
      const directoryTree = JSON.parse(
        JSON.stringify(current(state.directoryTree))
      ) as DirectoryTree;

      const recursiveUpdate = (
        array: IDirectory[],
        searchTerm: string
      ): IDirectory[] => {
        return array.reduce((prev: any, curr) => {
          const subDirectory = curr.sub_directory
            ? recursiveUpdate(curr.sub_directory, searchTerm)
            : undefined;
          curr.files = curr.files.map((i) => {
            if (i._id === action.payload._id) i = action.payload;
            return i;
          });
          return [...prev, { ...curr, subDirectory }];
        }, []);
      };
      state.directoryTree.directories = recursiveUpdate(
        directoryTree.directories,
        action.payload._id
      );
    },
  },
});

export const {
  setDirectoryTree,
  addToOpenedFiles,
  setActiveOpenedFile,
  setWorkspaceName,
  toggleFileModifiedStatus,
  removeFileFromOpenedFiles,
  updateDirectoryTree,
  updateFile,
} = app.actions;

export default app.reducer;
