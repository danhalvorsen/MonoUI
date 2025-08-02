import { JsonFileReader } from "../../file-operations/JsonFileReader.js";
import { IConfigProvider } from "../../models/IConfigProvider.js";

/**
 * File-based configuration provider implementation
 */
export class FileConfigProvider implements IConfigProvider {
    private readonly configPath: string;

    constructor(configPath: string) {
        this.configPath = configPath;
    }

    async getConfiguration<T = any>(): Promise<T> {
        console.log(`Reading configuration from: ${this.configPath}`);      
        return new JsonFileReader().readJson<T>(this.configPath);
    }
}
