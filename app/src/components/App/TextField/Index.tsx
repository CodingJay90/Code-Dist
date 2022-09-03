import Arrow from "@/components/Icons/Arrow";
import FolderIcon from "@/components/Icons/FolderIcon";
import { StyledFlex } from "@/elements/Global";
import React, { useRef } from "react";
import { Input, InputWrapper, Wrapper } from "./elements";

interface IProps {
  showTextField: boolean;
  setShowTextField: React.Dispatch<React.SetStateAction<boolean>>;
}

const TextField = ({
  showTextField,
  setShowTextField,
}: IProps): JSX.Element | null => {
  if (!showTextField) return null;

  function onTextFieldChange(e: React.KeyboardEvent): void {
    if (e.key === "Escape" || e.code === "Escape") {
      setShowTextField(false);
      return;
    }
    console.log(e.key, e.code);
  }

  return (
    <Wrapper>
      <StyledFlex justify="flex-start">
        <Arrow direction="right" />
        <FolderIcon />
        <InputWrapper>
          <Input
            ref={(input: HTMLInputElement) => input?.focus()}
            onBlur={() => setShowTextField(false)}
            onKeyDown={onTextFieldChange}
          />
        </InputWrapper>
      </StyledFlex>
    </Wrapper>
  );
};

export default TextField;
