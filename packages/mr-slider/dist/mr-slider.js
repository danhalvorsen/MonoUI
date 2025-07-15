var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MrSlider_onInput;
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
let MrSlider = class MrSlider extends LitElement {
    constructor() {
        super(...arguments);
        this.value = 50;
        this.min = 0;
        this.max = 100;
        _MrSlider_onInput.set(this, (e) => {
            const target = e.target;
            this.value = Number(target.value);
            this.dispatchEvent(new CustomEvent('change', {
                detail: this.value,
                bubbles: true
            }));
        });
    }
    render() {
        return html `
      <input 
        class="slider" 
        type="range"
        .value=${String(this.value)}
        .min=${String(this.min)}
        .max=${String(this.max)}
        @input=${__classPrivateFieldGet(this, _MrSlider_onInput, "f")} 
      />
      <span class="value-display">${this.value}</span>
    `;
    }
};
_MrSlider_onInput = new WeakMap();
MrSlider.styles = css `
    :host { 
      display: inline-block; 
      width: 200px; 
      height: 32px; 
    }
    .slider { 
      width: 100%; 
    }
    .value-display {
      margin-left: 8px;
      font-family: monospace;
    }
  `;
__decorate([
    property({ type: Number })
], MrSlider.prototype, "value", void 0);
__decorate([
    property({ type: Number })
], MrSlider.prototype, "min", void 0);
__decorate([
    property({ type: Number })
], MrSlider.prototype, "max", void 0);
MrSlider = __decorate([
    customElement('mr-slider')
], MrSlider);
export { MrSlider };
