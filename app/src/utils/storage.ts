import { IFile } from "@/graphql/models/app.interface";
interface IFileView extends IFile {
  isModified?: boolean;
}

enum Keys {
  SELECTED_FILE = "selected_file",
  ACTIVE_OPENED_FILE = "active_opened_file",
  OPENED_FILES = "opened_files",
}

interface IStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
type StorageType = "localStorage" | "sessionStorage";

export abstract class Storage<T extends string> {
  private readonly storage: IStorage;

  public constructor(getStorage = (): IStorage => window.localStorage) {
    this.storage = getStorage();
  }

  protected get(key: T): string | null {
    return this.storage.getItem(key);
  }

  protected set(key: T, value: string): void {
    this.storage.setItem(key, value);
  }

  protected clearItem(key: T): void {
    this.storage.removeItem(key);
  }

  protected clearItems(keys: T[]): void {
    keys.forEach((key) => this.clearItem(key));
  }
}

export default class UseLocalStorage extends Storage<Keys> {
  private static instance?: UseLocalStorage;

  private constructor() {
    super();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new UseLocalStorage();
    }

    return this.instance;
  }

  public getSelectedFile(): IFileView {
    return JSON.parse(this.get(Keys.SELECTED_FILE) || "{}");
  }

  public getActiveOpenedFile(): IFileView | null {
    return JSON.parse(this.get(Keys.ACTIVE_OPENED_FILE) || "null");
  }

  public getOpenedFiles(): IFileView[] {
    const files = JSON.parse(this.get(Keys.OPENED_FILES) || "{}");
    return Array.isArray(files) ? files : [];
  }

  public setSelectedFile(file: IFileView | null) {
    this.set(Keys.SELECTED_FILE, JSON.stringify(file || null));
  }

  public setActiveOpenedFile(file: IFileView | null) {
    this.set(Keys.ACTIVE_OPENED_FILE, JSON.stringify(file || null));
  }

  public setOpenedFiles(file: IFileView[]) {
    this.set(Keys.OPENED_FILES, JSON.stringify(file));
  }

  public clear() {
    this.clearItems([
      Keys.SELECTED_FILE,
      Keys.OPENED_FILES,
      Keys.ACTIVE_OPENED_FILE,
    ]);
  }
}
