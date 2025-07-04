import 'mr-basic/dist/mr-basic.js';
import { container } from 'tsyringe';
import { MrBasic, ScaleController, MouseController, DragController } from 'mr-basic';
// Register controllers
container.register(ScaleController, { useClass: ScaleController });
container.register(MouseController, { useClass: MouseController });
container.register(DragController, { useClass: DragController });
const element = container.resolve(MrBasic);
document.body.appendChild(element);
