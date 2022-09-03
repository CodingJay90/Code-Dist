import { StyledFlex } from "@/elements/Global";
import { IDirectory } from "@/graphql/models/app.interface";
import {
  FolderArrowIcon,
  FolderBlock,
  FolderIcon,
  FolderName,
  FolderWrapper,
} from "./elements";

interface IProps {
  folder: IDirectory;
  children: JSX.Element;
  nested: boolean;
}

const Folder = ({ folder, children, nested }: IProps) => {
  return (
    <FolderBlock key={folder.directory_id} nested={nested}>
      <FolderWrapper justify="flex-start">
        <FolderArrowIcon direction="right" />
        <FolderIcon />
        <FolderName>{folder.directory_name}</FolderName>
      </FolderWrapper>
      {children}
    </FolderBlock>
  );
};

export default Folder;
