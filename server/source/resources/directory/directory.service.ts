import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import { baseDirectory } from '@/utils/constants.js';
import { nanoid } from 'nanoid';
import unZipper from 'unzipper';
import AdmZip, { IZipEntry } from 'adm-zip';
import { ErrorResponse } from '@/utils/exceptions/http.exceptions';
import {
    FileEntry,
    IDirectory,
    ZipEntry,
} from '@/resources/directory/directory.interface';

/*
 const loopThrough = () => {
            const sorted = listDirectories.map((dir, index, dirs) => {
                let currentIndex = dirs.indexOf(dir);
                let nextArrayIndex = (currentIndex + 1) % dirs.length;
                const nextElement = dirs[nextArrayIndex].entryName;
                if (nextElement.includes(dir.entryName)) {
                    dir.childDir.push(nextElement);
                    dirs.splice(dirs.indexOf(dirs[nextArrayIndex]), 1);
                }
                if (index === dirs.length) loopThrough();
                return dir;
            });
            return sorted;
        };
        return loopThrough();
*/

class DirectoryService {
    //Read all contents in a zip file
    public async readZip(pathToDir: string): Promise<FileEntry[]> {
        const zip = new AdmZip(pathToDir);
        const zipEntries = zip.getEntries();
        async function main() {
            const directory = await unZipper.Open.file(pathToDir);
            return directory;
        }
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

    private formatDirectoryStructure(directory: FileEntry): IDirectory {
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
        fileEntries: FileEntry[]
    ): Promise<IDirectory[]> {
        let listDirectories = fileEntries.filter((i) => i.isDirectory).sort();
        let addedChildDirectory: Array<string> = [];
        const sorted = listDirectories.map((dir, index, dirs) => {
            let indexCount = 0;
            while (indexCount < dirs.length) {
                const nextElement = dirs[indexCount];
                //split the path(entryName string) into array in order to compare
                const currentDirComparison = dir.entryName.split('/');
                const nextDirComparison = nextElement.entryName.split('/');
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
                    dir['sub_directory']?.push(
                        this.formatDirectoryStructure(nextElement)
                    );
                    addedChildDirectory.push(nextElement.entryName);
                }
                indexCount++;
            }
            return dir;
        });
        return sorted
            .filter((i) => !addedChildDirectory.includes(i.entryName))
            .map((i) => this.formatDirectoryStructure(i));
    }
    // ==============================================================================

    public checkForChildDirectory(dir: string, parent?: string) {
        return fs
            .readdirSync(dir, { withFileTypes: true })
            .filter((i) => i.isDirectory())
            .map((i) => ({
                name: i.name,
                path: path.resolve(baseDirectory, `${parent}/${i.name}`),
            }));
    }

    public checkForChild(children: any, parent?: any) {
        children?.map((i: any) => {
            if (
                this.checkForChildDirectory(path.resolve(baseDirectory, i.path))
                    .length
            ) {
                i.child = this.checkForChildDirectory(
                    path.resolve(baseDirectory, i.path),
                    i.path
                );
            }
            this.checkForChild(i.child);
        });
        return children;
    }

    public async listDirectories(rootPath: string) {
        try {
            let allDir: any = [];
            this.readAllDirectory(rootPath).map((i) => {
                allDir.push(i);
                if (
                    this.checkForChildDirectory(
                        path.resolve(baseDirectory, i.path)
                    ).length
                ) {
                    i.child = this.checkForChildDirectory(
                        path.resolve(baseDirectory, i.path),
                        i.name
                    );
                    this.checkForChild(i.child);
                }
            });
            console.log(allDir);
            return allDir;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public renameDirectory(oldDir: string, newDir: string) {
        try {
            if (!this.checkDirectoryExists(oldDir))
                throw new ErrorResponse('No such directory', 400);
            fs.renameSync(path.resolve(oldDir), path.resolve(newDir));
            return true;
        } catch (error) {
            throw new ErrorResponse(
                "Couldn't rename directory due to your permission settings",
                400
            );
        }
    }

    public deleteDirectory(dir: string) {
        try {
            if (!this.checkDirectoryExists(dir))
                throw new ErrorResponse('No such directory', 400);
            fs.rmdirSync(dir, { recursive: true });
        } catch (error) {
            throw error;
        }
    }

    public readAllDirectory(
        source: string
    ): { name: string; path: string; child?: any }[] {
        try {
            return fs
                .readdirSync(source, { withFileTypes: true })
                .filter((dir) => dir.isDirectory())
                .map((dir) => ({
                    name: dir.name,
                    path: path.resolve(baseDirectory, dir.name),
                }));
        } catch (error) {
            throw error;
        }
    }

    public createDirectory(dir: string) {
        try {
            if (this.checkDirectoryExists(dir))
                throw new ErrorResponse(
                    'Directory name exist, try a new one',
                    200
                );
            fs.mkdirSync(dir, { recursive: true });
        } catch (error) {
            throw error;
        }
    }

    public moveDirectory(oldDir: string, newDir: string) {
        try {
            fse.moveSync(oldDir, newDir);
            // jp.moveAsync(oldDir, newDir);
        } catch (error) {
            throw error;
        }
    }

    // returns true if the directory exist
    public checkDirectoryExists(dir: string) {
        try {
            if (fs.existsSync(dir)) return true;
            return false;
        } catch (error) {
            throw error;
        }
    }
}

export default DirectoryService;
