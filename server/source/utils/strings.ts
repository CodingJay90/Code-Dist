import mongoose from 'mongoose';

export const removeTrailingSlash = (str: string) =>
    str.split('/').filter(Boolean).join('/');

export function transFormIdToMongooseId(id: string): string {
    let mongo_id: any = id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('not valid');
        mongo_id = new mongoose.Types.ObjectId();
        console.log(mongo_id);
    }

    return mongo_id;
}
