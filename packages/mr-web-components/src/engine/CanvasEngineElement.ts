// import { LitElement, html, css } from 'lit';
// import { customElement, property, query } from 'lit/decorators.js';
// import { CanvasEngine, IVisualObject } from 'mr-abstract-components';
// import { RequestAnimationLoop } from "./RequestAnimationLoop.js";
// import { Rectangle } from '../visualObjects/rectangle.js';

// @customElement('html-canvas')
// export class HtmlCanvas
//   extends LitElement
//   implements CanvasEngine<CanvasRenderingContext2D>
// {
//   static styles = css`
//     :host {
//       display: block;
//       width: 100%;
//       height: 100%;
//     }
//     canvas {
//       width: 100%;
//       height: 100%;
//     }
//   `;

//   @property({ type: Number }) width = 300;
//   @property({ type: Number }) height = 150;
  
//   // Property to add visual objects declaratively or programmatically
//   @property({ type: Array, attribute: false })
//   objects: IVisualObject<CanvasRenderingContext2D>[] = [];
  
//   // String attribute for adding objects via JSON (for declarative HTML usage)
//   @property({ type: String, attribute: 'objects-json' })
//   objectsJson: string = '';

//   @query('canvas')
//   private _canvas!: HTMLCanvasElement;
//   private _ctx!: CanvasRenderingContext2D;
//   private _objects: IVisualObject<CanvasRenderingContext2D>[] = [];
//   private _loop = new RequestAnimationLoop();

//   get context(): CanvasRenderingContext2D {
//     return this._ctx;
//   }

//   connectedCallback(): void {
//     super.connectedCallback();
//     this._loop.onTick((dt: number) => this._tick(dt));
//     this._loop.start();
//   }

//   disconnectedCallback(): void {
//     super.disconnectedCallback();
//     this._loop.stop();
//   }

//   updated(changedProperties: Map<string | number | symbol, unknown>): void {
//     super.updated(changedProperties);
    
//     // Handle objects property changes
//     if (changedProperties.has('objects')) {
//       this._syncObjectsFromProperty();
//     }
    
//     // Handle objects-json attribute changes
//     if (changedProperties.has('objectsJson')) {
//       this._syncObjectsFromJson();
//     }
//   }

//   private _syncObjectsFromProperty(): void {
//     // Clear current objects and add new ones from the objects property
//     this._objects = [...this.objects];
//   }

//   private _syncObjectsFromJson(): void {
//     if (this.objectsJson) {
//       try {
//         const objectsData = JSON.parse(this.objectsJson);
//         // This would need a factory pattern to recreate objects from JSON
//         // For now, we'll just log the parsed data
//         console.log('Objects from JSON:', objectsData);
//         // TODO: Implement object factory to create IVisualObject instances from JSON
//       } catch (error) {
//         console.error('Failed to parse objects-json:', error);
//       }
//     }
//   }

//   firstUpdated(): void {
//     this._canvas.width = this.width;
//     this._canvas.height = this.height;
//     const ctx = this._canvas.getContext('2d');
//     if (!ctx) throw new Error('Failed to get 2D context');
//     this._ctx = ctx;

//     // Add click event listener
//     this._canvas.addEventListener('click', (event) => this._handleClick(event));
//     console.log('Canvas click event listener added');

//     // Add rectangles to the canvas with IDs
//     console.log(`HtmlCanvas firstUpdated`);
//     const rect1 = new Rectangle(50, 50, '#3498db', 100, 100, { x: 0, y: 0 }, undefined, 'Rect1');
//     this.add(rect1);
//     const rect2 = new Rectangle(50,50, '#1498db', 200, 100, { x: 0, y: 0 }, undefined, 'Rect2');
//     this.add(rect2);
//   }

//   add(obj: IVisualObject<CanvasRenderingContext2D>): void {
//     this._objects.push(obj);
//     // Keep the reactive property in sync
//     this.objects = [...this._objects];
//   }

//   // Convenient method to add multiple objects at once
//   addObjects(objects: IVisualObject<CanvasRenderingContext2D>[]): void {
//     this._objects.push(...objects);
//     this.objects = [...this._objects];
//   }

//   // Overloads to remain compatible with HTMLElement.remove()
//   remove(): void;
//   remove(obj: IVisualObject<CanvasRenderingContext2D>): void;
//   remove(obj?: IVisualObject<CanvasRenderingContext2D>): void {
//     if (obj) {
//       const idx = this._objects.indexOf(obj);
//       if (idx >= 0) {
//         this._objects.splice(idx, 1);
//         // Keep the reactive property in sync
//         this.objects = [...this._objects];
//       }
//     } else {
//       super.remove();
//     }
//   }

//   clear(): void {
//     this._objects.length = 0;
//     // Keep the reactive property in sync
//     this.objects = [];
//     if (this._ctx) this._ctx.clearRect(0, 0, this.width, this.height);
//   }

//   private _handleClick(event: MouseEvent): void {
//     // Get raw mouse coordinates
//     const rawMouseX = event.offsetX;
//     const rawMouseY = event.offsetY;
    
//     // Calculate scaling factors
//     const scaleX = this._canvas.width / this._canvas.clientWidth;
//     const scaleY = this._canvas.height / this._canvas.clientHeight;
    
//     // Convert to logical canvas coordinates
//     const mouseX = rawMouseX * scaleX;
//     const mouseY = rawMouseY * scaleY;
    
//     console.log(`\n=== HIT FUNCTION EVALUATION ===`);
//     console.log(`Raw click at (${rawMouseX}, ${rawMouseY})`);
//     console.log(`Canvas size: ${this._canvas.width} x ${this._canvas.height}`);
//     console.log(`Client size: ${this._canvas.clientWidth} x ${this._canvas.clientHeight}`);
//     console.log(`Scale factors: ${scaleX.toFixed(2)} x ${scaleY.toFixed(2)}`);
//     console.log(`Logical click at (${mouseX.toFixed(1)}, ${mouseY.toFixed(1)})`);
//     console.log(`Total objects to check: ${this._objects.length}`);
    
//     // Check each rectangle for clicks
//     for (let i = 0; i < this._objects.length; i++) {
//       const obj = this._objects[i];
//       if (obj instanceof Rectangle) {
//         console.log(`\n--- Evaluating ${obj.id} ---`);
//         console.log(`Rectangle position: (${obj.position.x}, ${obj.position.y})`);
//         console.log(`Rectangle size: ${obj.width} x ${obj.height}`);
//         console.log(`Rectangle bounds: X[${obj.position.x} to ${obj.position.x + obj.width}], Y[${obj.position.y} to ${obj.position.y + obj.height}]`);
        
//         // Evaluate each condition separately
//         const xMin = mouseX >= obj.position.x;
//         const xMax = mouseX <= obj.position.x + obj.width;
//         const yMin = mouseY >= obj.position.y;
//         const yMax = mouseY <= obj.position.y + obj.height;
        
//         console.log(`Hit test conditions:`);
//         console.log(`  mouseX (${mouseX}) >= rect.x (${obj.position.x}): ${xMin}`);
//         console.log(`  mouseX (${mouseX}) <= rect.x + width (${obj.position.x + obj.width}): ${xMax}`);
//         console.log(`  mouseY (${mouseY}) >= rect.y (${obj.position.y}): ${yMin}`);
//         console.log(`  mouseY (${mouseY}) <= rect.y + height (${obj.position.y + obj.height}): ${yMax}`);
        
//         const inBounds = xMin && xMax && yMin && yMax;
//         console.log(`Final result: ${inBounds}`);
        
//         if (inBounds) {
//           console.log(`🎯 HIT: ${obj.id}`);
//           obj.selected = !obj.selected;
//           console.log(`Selection state changed to: ${obj.selected}`);
//         } else {
//           console.log(`❌ MISS: ${obj.id}`);
//         }
//       }
//     }
//     console.log(`=== END HIT EVALUATION ===\n`);
//   }

//   private _tick(dt: number): void {
//     if (!this._ctx) return;
//     this._ctx.clearRect(0, 0, this.width, this.height);
//     for (const obj of this._objects) {
//       obj.update(dt);
//       obj.render(this._ctx);
//     }
//   }

//   render() {
//     return html`<canvas></canvas>`;
//   }
// }

// export type Canvas2DEngine = HtmlCanvas;
