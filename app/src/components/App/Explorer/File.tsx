import { IFile } from "@/graphql/models/app.interface";
import React from "react";
import { FcFile } from "react-icons/fc";
import { FileContainer, FileIcon, FileName, FileWrapper } from "./elements";

interface IProps {
  file: IFile;
}

const File = ({ file }: IProps) => {
  return (
    <FileContainer nested={true}>
      <FileWrapper>
        <FileIcon>
          <FcFile />
        </FileIcon>
        <FileName>{file.file_name}</FileName>
      </FileWrapper>
    </FileContainer>
  );
};

export default File;
