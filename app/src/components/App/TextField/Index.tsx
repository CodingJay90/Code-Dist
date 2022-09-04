import Arrow from "@/components/Icons/Arrow";
import FolderIcon from "@/components/Icons/FolderIcon";
import { StyledFlex } from "@/elements/Global";
import {
  useCreateDirectory,
  useRenameDirectory,
} from "@/graphql/mutations/app.mutations";
import React, { useState } from "react";
import { Input, InputWrapper, Wrapper } from "./elements";
import { ActionType } from "@/components/App/types";

interface IProps {
  showTextField: boolean;
  setShowTextField: React.Dispatch<React.SetStateAction<boolean>>;
  directoryPath: string;
  directoryId: string;
  actionType: ActionType;
  defaultValue: string;
}

const TextField = ({
  showTextField,
  setShowTextField,
  directoryPath,
  defaultValue,
  actionType,
  directoryId,
}: IProps): JSX.Element | null => {
  const [newDirectoryName, setNewDirectoryName] = useState<string>("");
  const { createDirectory } = useCreateDirectory({
    directoryName: newDirectoryName,
    directoryPath,
  });
  const { renameDirectory } = useRenameDirectory({
    id: directoryId,
    directoryName: newDirectoryName,
  });

  function onTextFieldChange(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Escape" || e.code === "Escape") {
      setShowTextField(false);
      return;
    }
    if (e.key === "Enter" || e.code === "Enter") {
      console.log(directoryId);
      //   createDirectory();
      actionType === "rename" ? renameDirectory() : createDirectory();
      setShowTextField(false);
    }
    setNewDirectoryName(e.currentTarget.value);
  }

  if (!showTextField) return null;
  return (
    <Wrapper>
      <StyledFlex justify="flex-start">
        <Arrow direction="right" />
        <FolderIcon />
        <InputWrapper>
          <Input
            ref={(input: HTMLInputElement) => input?.focus()}
            onBlur={() => setShowTextField(false)}
            onKeyUp={onTextFieldChange}
            defaultValue={actionType === "rename" ? defaultValue : ""}
          />
        </InputWrapper>
      </StyledFlex>
    </Wrapper>
  );
};

export default TextField;
