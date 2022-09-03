import Arrow from "@/components/Icons/Arrow";
import FolderIcon from "@/components/Icons/FolderIcon";
import { StyledFlex } from "@/elements/Global";
import { useCreateDirectory } from "@/graphql/mutations/app.mutations";
import React, { useState } from "react";
import { Input, InputWrapper, Wrapper } from "./elements";

interface IProps {
  showTextField: boolean;
  setShowTextField: React.Dispatch<React.SetStateAction<boolean>>;
  directoryPath: string;
}

const TextField = ({
  showTextField,
  setShowTextField,
  directoryPath,
}: IProps): JSX.Element | null => {
  const [newDirectoryName, setNewDirectoryName] = useState<string>("");
  const { createDirectory, error } = useCreateDirectory({
    directoryName: newDirectoryName,
    directoryPath,
  });

  function onTextFieldChange(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Escape" || e.code === "Escape") {
      setShowTextField(false);
      return;
    }
    if (e.key === "Enter" || e.code === "Enter") {
      console.log(e.key, e.code);
      createDirectory();
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
          />
        </InputWrapper>
      </StyledFlex>
    </Wrapper>
  );
};

export default TextField;
