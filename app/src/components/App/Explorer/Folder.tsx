import { StyledFlex } from "@/elements/Global";
import { IDirectory } from "@/graphql/models/app.interface";
import { useState } from "react";
import {
  FolderArrowIcon,
  FolderBlock,
  FolderIcon,
  FolderName,
  FolderWrapper,
  NestedFolder,
} from "./elements";

interface IProps {
  folder: IDirectory;
  children: JSX.Element;
  nested: boolean;
}

const Folder = ({ folder, children, nested }: IProps): JSX.Element => {
  const [showSubFolders, setShowSubFolders] = useState<boolean>(false);
  return (
    <FolderBlock
      key={folder.directory_id}
      nested={nested}
      className="clickToCloseNested"
    >
      <FolderWrapper
        justify="flex-start"
        onClick={() => setShowSubFolders(!showSubFolders)}
      >
        <FolderArrowIcon direction={showSubFolders ? "down" : "right"} />
        <FolderIcon />
        <FolderName>{folder.directory_name}</FolderName>
      </FolderWrapper>
      {showSubFolders && (
        <NestedFolder className="nest">{children}</NestedFolder>
      )}
    </FolderBlock>
  );
};

export default Folder;
