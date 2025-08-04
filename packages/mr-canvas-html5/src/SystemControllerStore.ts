
export interface ISystemController {
    // Define the expected properties and methods for ISystemController here
}

export class SystemControllerStore {
    private controllers: Set<ISystemController> = new Set();

    add(obj: ISystemController): void {
        this.controllers.add(obj);
    }

    remove(obj: ISystemController): void {
        this.controllers.delete(obj);
    }

    clear(): void {
        this.controllers.clear();
    }
}
