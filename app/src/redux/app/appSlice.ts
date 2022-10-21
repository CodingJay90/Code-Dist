import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/reduxStore/store";
import { IDirectory, IFile } from "@/graphql/models/app.interface";
import UseLocalStorage from "@/utils/storage";
import { removeTrailingSlash } from "@/utils/string";

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
      console.log(action.payload.isUntitled);
      const newActiveOpenedFileState = {
        ...state.activeOpenedFile,
        ...action.payload,
        ...(action.payload.isUntitled === undefined && { isUntitled: false }),
        ...(action.payload.isModified === undefined && { isModified: false }),
      };
      console.log(newActiveOpenedFileState);
      getLocalStorage.setActiveOpenedFile(newActiveOpenedFileState);
      state.activeOpenedFile = newActiveOpenedFileState;
    },
    toggleFileModifiedStatus: (
      state,
      action: PayloadAction<{ fileId: string; status: boolean }>
    ) => {
      const fileToUpdate = current(state.openedFiles).find(
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
      const updatedOpenedFiles = current(state.openedFiles).map((file) =>
        file._id === fileToUpdate._id ? fileToUpdate : file
      );
      getLocalStorage.setOpenedFiles(updatedOpenedFiles);
      getLocalStorage.setActiveOpenedFile(fileToUpdate);
      state.openedFiles = updatedOpenedFiles;
      state.activeOpenedFile = fileToUpdate;
    },
    updateFileOnEditorLeave: (
      state,
      action: PayloadAction<{ fileToUpdate: IFile; status: boolean }>
    ) => {
      const fileToUpdate = {
        ...JSON.parse(JSON.stringify(action.payload.fileToUpdate)),
        isModified: state.activeOpenedFile?.isModified ?? false,
      } as IFile;
      // fileToUpdate.isModified = action.payload.status;
      const updatedOpenedFiles = current(state.openedFiles).map((file) =>
        file._id === fileToUpdate._id ? fileToUpdate : file
      );
      getLocalStorage.setOpenedFiles(updatedOpenedFiles);
      state.openedFiles = updatedOpenedFiles;
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
          return [...prev, { ...curr, sub_directory: subDirectory }];
        }, []);
      };
      state.directoryTree.directories = recursiveUpdate(
        directoryTree.directories,
        action.payload._id
      );
    },
    removeAllFilesOnView: (state) => {
      state.activeOpenedFile = null;
      getLocalStorage.setActiveOpenedFile(null);
      getLocalStorage.setOpenedFiles([]);
      state.openedFiles = [];
    },
    moveFile: (
      state,
      action: PayloadAction<{ file: IFile; directory: IDirectory }>
    ) => {
      const { file, directory } = action.payload;
      const directoryTree = JSON.parse(
        JSON.stringify(current(state.directoryTree))
      ) as DirectoryTree;

      const recursiveUpdate = (array: IDirectory[]): IDirectory[] => {
        return array.reduce((prev: any, curr) => {
          const subDirectory = curr.sub_directory
            ? recursiveUpdate(curr.sub_directory)
            : undefined;
          curr.files = curr.files.filter((f) => f._id !== file._id);
          // curr.files.splice(curr.files.indexOf(file));
          if (curr._id === directory._id) {
            curr.files.push(file);
          }
          return [...prev, { ...curr, sub_directory: subDirectory }];
        }, []);
      };
      // console.log(recursiveUpdate(directoryTree.directories));
      state.directoryTree.directories = recursiveUpdate(
        directoryTree.directories
      );
    },
    moveFolder: (
      state,
      action: PayloadAction<{
        prevDirectory: IDirectory;
        newDirectory: IDirectory;
      }>
    ) => {
      const { newDirectory, prevDirectory } = action.payload;
      const directoryTree = JSON.parse(
        JSON.stringify(current(state.directoryTree))
      ) as DirectoryTree;
      if (prevDirectory.directory_path === newDirectory.directory_path) return;
      const recursiveUpdate = (array: IDirectory[]): IDirectory[] => {
        return array.reduce((prev: any, curr) => {
          if (curr._id === prevDirectory._id) {
            const updateFilePath = (
              dir: IDirectory[],
              path: string
            ): IDirectory[] => {
              return dir.map((i) => {
                const newPath = `${path}${i.directory_name}/`;
                i = {
                  ...i,
                  directory_path: newPath,
                  files: i.files.map((file) => ({
                    ...file,
                    file_dir: newPath.concat(file.file_name),
                  })),
                };
                if (i.sub_directory.length)
                  updateFilePath(i.sub_directory, newPath);
                return i;
              });
            };
            const newPath = `${curr.directory_path}${newDirectory.directory_name}/`;
            let newUpdatedDirectory = {
              ...newDirectory,
              directory_path: newPath,
              files: newDirectory.files.map((i) => ({
                ...i,
                file_dir: newPath.concat(i.file_name),
              })),
            };
            curr.sub_directory.push({
              ...newUpdatedDirectory,
              sub_directory: updateFilePath(
                newUpdatedDirectory.sub_directory,
                newPath
              ),
            });
            // console.log(
            //   updateFilePath(newUpdatedDirectory.sub_directory, newPath)
            // );
          }
          const subDirectory = curr.sub_directory
            ? recursiveUpdate(curr.sub_directory)
            : undefined;
          return [...prev, { ...curr, sub_directory: subDirectory }].filter(
            (x) => x.directory_path !== newDirectory.directory_path
          );
        }, []);
      };
      // console.log(recursiveUpdate(directoryTree.directories));
      state.directoryTree.directories = recursiveUpdate(
        directoryTree.directories
      );
    },
    createDirectoryOrFileAction: (
      state,
      action: PayloadAction<{
        newDirectory?: IDirectory;
        directoryId: string;
        newFile?: IFile;
      }>
    ) => {
      const { newDirectory, directoryId, newFile } = action.payload;
      const directoryTree = JSON.parse(
        JSON.stringify(current(state.directoryTree))
      ) as DirectoryTree;

      const recurseDirectoryTree = (directories: IDirectory[]): IDirectory[] =>
        directories.map((elem) => {
          return {
            ...elem,
            ...(newFile && {
              files:
                elem._id === directoryId
                  ? [...elem.files, newFile]
                  : elem.files,
            }),
            sub_directory:
              newDirectory && elem._id === directoryId
                ? [...elem.sub_directory, newDirectory]
                : recurseDirectoryTree(elem.sub_directory),
          };
        });

      state.directoryTree.directories = recurseDirectoryTree(
        directoryTree.directories
      );
    },
    renameDirectoryOrFileAction: (
      state,
      action: PayloadAction<{
        newDirectoryName?: string;
        directoryId: string;
        newFileName?: string;
        fileId?: string;
      }>
    ) => {
      const { newDirectoryName, directoryId, newFileName, fileId } =
        action.payload;
      const directoryTree = JSON.parse(
        JSON.stringify(current(state.directoryTree))
      ) as DirectoryTree;
      const updateDirectoryPath = (
        dirPath: string,
        newDirNamePath: string
      ): string => {
        const splits = removeTrailingSlash(dirPath).split("/");
        splits.pop();
        return `${splits.join("/")}/${newDirNamePath}/`;
      };

      const updateSubDirectoryPaths = (
        dirPath: string,
        parentDirName: string,
        newDirNamePath: string
      ): string => {
        const matchedIndexFromParentPath = dirPath
          .split("/")
          .findIndex((i) => i === parentDirName);
        let dirPathSplits = dirPath.split("/");
        dirPathSplits[matchedIndexFromParentPath] = newDirNamePath;
        return dirPathSplits.join("/");
      };

      const updateNestedDirectoryPaths = (
        dirs: IDirectory[],
        directoryName: string,
        newDirectoryPathName: string
      ): IDirectory[] => {
        return dirs.map((i) => ({
          ...i,
          files: i.files.map((file) => ({
            ...file,
            file_dir: updateSubDirectoryPaths(
              file.file_dir,
              directoryName,
              newDirectoryPathName
            ),
          })),
          directory_path: updateSubDirectoryPaths(
            i.directory_path,
            directoryName,
            newDirectoryPathName
          ),
          sub_directory: updateNestedDirectoryPaths(
            i.sub_directory,
            directoryName,
            newDirectoryPathName
          ),
        }));
      };

      const recurseDirectoryTree = (directories: IDirectory[]): IDirectory[] =>
        directories.map((dir) => {
          return {
            ...dir,
            ...(dir._id === directoryId &&
              newDirectoryName && {
                directory_name: newDirectoryName,
                directory_path: updateDirectoryPath(
                  dir.directory_path,
                  newDirectoryName
                ),
                files: dir.files.map((file) => ({
                  ...file,
                  file_dir: updateSubDirectoryPaths(
                    file.file_dir,
                    dir.directory_name,
                    newDirectoryName
                  ),
                })),
              }),
            ...(dir._id === directoryId &&
              newFileName && {
                directory_name: newDirectoryName,
                files: dir.files.map((file) => {
                  return file._id === fileId
                    ? {
                        ...file,
                        file_name: newFileName,
                        file_dir: updateSubDirectoryPaths(
                          file.file_dir,
                          file.file_name,
                          newFileName
                        ),
                      }
                    : file;
                }),
              }),
            sub_directory:
              newDirectoryName && dir._id === directoryId
                ? updateNestedDirectoryPaths(
                    dir.sub_directory,
                    dir.directory_name,
                    newDirectoryName
                  )
                : recurseDirectoryTree(dir.sub_directory),
          };
        });

      // console.log(recurseDirectoryTree(directoryTree.directories));

      state.directoryTree.directories = recurseDirectoryTree(
        directoryTree.directories
      );
    },
    deleteDirectoryOrFileAction: (
      state,
      action: PayloadAction<{
        directoryId?: string;
        fileId?: string;
      }>
    ) => {
      const { directoryId, fileId } = action.payload;
      const directoryTree = JSON.parse(
        JSON.stringify(current(state.directoryTree))
      ) as DirectoryTree;

      const recurseDirectoryTree = (directories: IDirectory[]): IDirectory[] =>
        directories
          .map((elem) => {
            return {
              ...elem,
              files: elem.files.filter((file) => file._id !== fileId),
              sub_directory: recurseDirectoryTree(elem.sub_directory),
            };
          })
          .filter((i) => i._id !== directoryId);

      state.directoryTree.directories = recurseDirectoryTree(
        directoryTree.directories
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
  removeAllFilesOnView,
  updateFileOnEditorLeave,
  moveFile,
  moveFolder,
  createDirectoryOrFileAction,
  renameDirectoryOrFileAction,
  deleteDirectoryOrFileAction,
} = app.actions;

export default app.reducer;
