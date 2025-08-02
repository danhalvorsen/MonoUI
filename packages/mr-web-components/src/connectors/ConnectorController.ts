import type { IController, IVisualObject } from "mr-abstract-components";


export class ConnectorController implements IController {
    update(time: number, delta: number): void {
        throw new Error("Method not implemented.");
    }
    visualObjects: IVisualObject[];

}
