var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
let MrSlider = class MrSlider extends LitElement {
    constructor() {
        super();
        // LIT3: Use @property decorator from 'lit/decorators.js'
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "min", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "max", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.value = 50;
        this.min = 0;
        this.max = 100;
    }
    onInput(e) {
        const input = e.target;
        this.value = Number(input.value);
        this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
    }
    render() {
        return html `
      <input
        class="slider"
        type="range"
        .value=${String(this.value)}
        .min=${String(this.min)}
        .max=${String(this.max)}
        @input=${this.onInput}
      />
      <span>${this.value}</span>
    `;
    }
};
Object.defineProperty(MrSlider, "styles", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: css `
    :host {
      display: inline-block;
      width: 200px;
      height: 32px;
    }
    .slider {
      width: 100%;
    }
  `
});
__decorate([
    property({ type: Number, reflect: true })
], MrSlider.prototype, "value", void 0);
__decorate([
    property({ type: Number, reflect: true })
], MrSlider.prototype, "min", void 0);
__decorate([
    property({ type: Number, reflect: true })
], MrSlider.prototype, "max", void 0);
MrSlider = __decorate([
    customElement('mr-slider')
], MrSlider);
export { MrSlider };
