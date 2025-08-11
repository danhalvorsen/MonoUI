import { IReactiveController } from "../../controllers/IReactiveController.js";

 
export interface IEventSystemReactiveController 
extends IReactiveController {
	
}

export class EventSystemReactiveController implements IEventSystemReactiveController {
    hostConnected(): void {
        throw new Error("Method not implemented.");
    }
    hostDisconnected(): void {
        throw new Error("Method not implemented.");
    }
    hostUpdate?(): void {
        throw new Error("Method not implemented.");
    }
    hostUpdated?(): void {
        throw new Error("Method not implemented.");
    }
    // Implement the methods and properties required by IEventSystemReactiveController
}                           