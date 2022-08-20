import { Query, Resolver, Mutation, Arg } from 'type-graphql';
import { Directory } from '@/graphql/directory/directory.schema';
import FileService from '@/resources/file/file.service';
import DirectoryService from '@/resources/directory/directory.service';
import { baseDirectory } from '@/utils/constants';
import { multerUpload } from '@/middleware/multer.middleware';
import DirectoryModel from '@/resources/directory/directory.model';

@Resolver(() => Directory)
export class DirectoryResolver {
    // private users: User[] = [
    //     { id: 1, name: 'John Doe', email: 'johndoe@gmail.com' },
    //     { id: 2, name: 'Jane Doe', email: 'janedoe@gmail.com' },
    //     { id: 3, name: 'Mike Doe', email: 'mikedoe@gmail.com' },
    // ];
    private DirectoryService = new DirectoryService();
    private FileService = new FileService();

    constructor() {
        let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        methods
            .filter((method) => method !== 'constructor')
            .forEach((method: string) => {
                let _this: { [key: string]: any } = this;
                _this[method] = _this[method].bind(this);
            });
    }

    @Query(() => [Directory])
    async getDirectoryTree() {
        const start = new Date().getTime();
        const pathToDir = `${baseDirectory}/updated.zip`;
        const data = await this.DirectoryService.readZip(pathToDir);
        const mergedFilesAndFolders = this.FileService.addFilesToDirectory(
            data.filter((i) => i.isDirectory),
            data.filter((i) => !i.isDirectory)
        );
        const extractedDirectories =
            await this.DirectoryService.listDirectoriesInExtractedZip(
                mergedFilesAndFolders
            );
        await DirectoryModel.deleteMany({});
        await DirectoryModel.create({ directories: extractedDirectories });
        const end = new Date().getTime();
        const time = end - start;
        return extractedDirectories;
        // res.status(200).json({
        //     // files: mergedFilesAndFolders,
        //     data: extractedDirectories,
        //     time,
        // });
    }

    // @Query(() => User)
    // async getUser(@Arg('id') id: number): Promise<User | undefined> {
    //     const user = this.users.find((u) => u.id === id);
    //     return user;
    // }

    // @Mutation(() => User)
    // async createUser(@Arg('input') input: UserInput): Promise<User> {
    //     const user = {
    //         id: this.users.length + 1,
    //         ...input,
    //     };
    //     this.users.push(user);
    //     return user;
    // }

    // @Mutation(() => User)
    // async updateUser(
    //     @Arg('id') id: number,
    //     @Arg('input') input: UserInput
    // ): Promise<User> {
    //     const user = this.users.find((u) => u.id === id);
    //     if (!user) {
    //         throw new Error('User not found');
    //     }
    //     const updatedUser = {
    //         ...user,
    //         ...input,
    //     };
    //     this.users = this.users.map((u) => (u.id === id ? updatedUser : u));
    //     return updatedUser;
    // }
}
