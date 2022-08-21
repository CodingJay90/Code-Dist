import { FilterQuery, QueryOptions } from 'mongoose';
import { nanoid } from 'nanoid';
import unZipper from 'unzipper';
import AdmZip from 'adm-zip';
import {
    DirectoryMongooseDocument,
    FileEntry,
    IDirectory,
    ZipEntry,
} from '@/graphql/directory/directory.interface';
import {
    DirectoryModel,
    DirectoryTreeModel,
} from '@/graphql/directory/directory.model';

class DirectoryService {
    //Read all contents in a zip file
    public async readZip(pathToDir: string): Promise<FileEntry[]> {
        const zip = new AdmZip(pathToDir);
        const zipEntries = zip.getEntries();
        // async function main() {
        //     const directory = await unZipper.Open.file(pathToDir);
        //     return directory;
        // }
        return zipEntries.map((i: ZipEntry) => {
            if (!i.isDirectory) i.fileContent = i.getData().toString();
            return {
                entryName: i.entryName,
                name: i.name,
                isDirectory: i.isDirectory,
                fileContent: i.fileContent,
                sub_directory: [],
                files: [],
            };
        });
        // return main();
    }

    public formatDirectoryStructure(directory: FileEntry): IDirectory {
        return {
            directory_name:
                directory.entryName.split('/')[
                    directory.entryName.split('/').length - 2
                ],
            directory_path: directory.entryName,
            sub_directory: directory.sub_directory || [],
            directory_id: `directory-${nanoid(10)}`,
            isDirectory: directory.isDirectory,
            files: directory.files || [],
        };
    }

    public async listDirectoriesInExtractedZip(
        fileEntries: IDirectory[]
    ): Promise<IDirectory[]> {
        let listDirectories = fileEntries.filter((i) => i.isDirectory).sort();
        let addedChildDirectory: Array<string> = [];
        const sorted = listDirectories.map((dir, index, dirs) => {
            let indexCount = 0;
            while (indexCount < dirs.length) {
                const nextElement = dirs[indexCount];
                //split the path(entryName string) into array in order to compare
                const currentDirComparison = dir.directory_path.split('/');
                const nextDirComparison = nextElement.directory_path.split('/');
                /*
                    compare both arrays
                    e.g: currentDirComparison =  [ 'testZip', 'client', 'public', '' ]
                    e.g: nextDirComparison =  [ 'testZip', 'client', 'public', 'nestedInPublic', '' ]
                    
                    TODO:
                    1)takeout the last item on currentDirComparison
                    2)takeout the last 2 items on currentDirComparison (since paths are relative to each other)
                    3)then compare both arrays, if match add to the current iteration(Directory)
                */
                if (
                    JSON.stringify(
                        currentDirComparison.splice(
                            0,
                            currentDirComparison.length - 1
                        )
                    ) ===
                    JSON.stringify(
                        nextDirComparison.splice(
                            0,
                            nextDirComparison.length - 2
                        )
                    )
                ) {
                    // (async () => {
                    //     console.log('test');
                    //     const found = await DirectoryModel.findOne({
                    //         directoryPath: currentDirComparison.splice(
                    //             0,
                    //             currentDirComparison.length - 1
                    //         ),
                    //     });
                    //     // if (found) {
                    //     //     found.sub_directory.push(
                    //     //         this.formatDirectoryStructure(nextElement)
                    //     //             ?._id || ''
                    //     //     );
                    //     //     await found.save();
                    //     // }
                    //     // console.log(found);
                    // })();
                    // dir['sub_directory']?.push(
                    //     this.formatDirectoryStructure(nextElement)
                    // );
                    dir['sub_directory']?.push(nextElement);
                    addedChildDirectory.push(nextElement.directory_path);
                }
                indexCount++;
            }
            return dir;
        });
        return sorted
            .filter((i) => !addedChildDirectory.includes(i.directory_path))
            .map((i) => i);
    }

    //MONGOOSE SERVICES
    public async getDirectories(
        query: FilterQuery<IDirectory>,
        options: QueryOptions = { lean: true }
    ) {
        return DirectoryModel.find(query, {}, options);
    }
}

export default DirectoryService;
