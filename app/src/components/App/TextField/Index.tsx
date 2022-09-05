import Arrow from "@/components/Icons/Arrow";
import FolderIcon from "@/components/Icons/FolderIcon";
import { StyledFlex } from "@/elements/Global";
import {
  useCreateDirectory,
  useCreateFile,
  useRenameDirectory,
  useRenameFile,
} from "@/graphql/mutations/app.mutations";
import React, { useState } from "react";
import { Input, InputWrapper, Wrapper } from "./elements";
import { ActionType } from "@/components/App/types";
import FileIcon from "@/components/Icons/FileIcon";
import { IFile } from "@/graphql/models/app.interface";
import { useInteractionContext } from "@/contexts/interactions/InteractionContextProvider";

interface IProps {
  showTextField: boolean;
  setShowTextField: React.Dispatch<React.SetStateAction<boolean>>;
  directoryPath: string;
  directoryId: string;
  actionType: ActionType;
  defaultValue: string;
  isDirectory: boolean;
  fileId?: string;
}

const TextField = ({
  showTextField,
  setShowTextField,
  directoryPath,
  defaultValue,
  actionType,
  directoryId,
  isDirectory,
  fileId,
}: IProps): JSX.Element | null => {
  const [textField, setNewDirectoryName] = useState<string>(defaultValue);
  const { explorerInteractions, setExplorerInteractionsState } =
    useInteractionContext();
  const { createDirectory } = useCreateDirectory({
    directoryName: textField,
    directoryPath,
  });
  const { renameDirectory } = useRenameDirectory({
    id: directoryId,
    directoryName: textField,
  });

  const { renameFile } = useRenameFile({
    fileName: textField,
    id: fileId ?? "",
  });

  const { createFile } = useCreateFile({
    dir: directoryPath,
    fileName: textField,
  });

  function closeTextField(): void {
    setShowTextField(false);
    setExplorerInteractionsState({
      ...explorerInteractions,
      explorerNavCreateFile: false,
      explorerNavCreateDirectory: false,
    });
  }

  function onTextFieldChange(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Escape" || e.code === "Escape") {
      closeTextField();
      return;
    }
    if (e.key === "Enter" || e.code === "Enter") {
      if (isDirectory) {
        actionType === "rename" ? renameDirectory() : createDirectory();
      } else {
        actionType === "rename" ? renameFile() : createFile();
      }
      setShowTextField(false);
    }
    setNewDirectoryName(e.currentTarget.value);
  }

  if (!showTextField) return null;
  return (
    <Wrapper>
      <StyledFlex justify="flex-start">
        {isDirectory && <Arrow direction="right" />}
        {isDirectory ? <FolderIcon /> : <FileIcon />}
        <InputWrapper>
          <Input
            ref={(input: HTMLInputElement) => input?.focus()}
            onBlur={() => {
              closeTextField();
            }}
            onKeyUp={onTextFieldChange}
            defaultValue={actionType === "rename" ? defaultValue : ""}
          />
        </InputWrapper>
      </StyledFlex>
    </Wrapper>
  );
};

export default TextField;
