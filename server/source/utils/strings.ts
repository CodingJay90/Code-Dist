import mongoose from 'mongoose';

export const removeTrailingSlash = (str: string): string =>
  str.split('/').filter(Boolean).join('/');

export function transFormIdToMongooseId(id: string): string {
  let mongoId: any = id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('not valid');
    mongoId = new mongoose.Types.ObjectId();
    console.log(mongoId);
  }

  return mongoId;
}
