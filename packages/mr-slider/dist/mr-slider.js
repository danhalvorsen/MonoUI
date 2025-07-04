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
        /* ---------- reactive props (shadow-safe) ---------- */
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 50
        });
        Object.defineProperty(this, "min", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "max", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 100
        });
        // No need for constructor unless you have custom logic
        /* ---------- events ---------- */
        _MrSlider_onInput.set(this, (e) => {
            this.value = Number(e.target.value);
            this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
        });
    }
    /* ---------- render ---------- */
    render() {
        console.log('render mr-slider', this.value, this.min, this.max);
        return html `
      <input class="slider" type="range"
        .value=${String(this.value)}
        .min=${String(this.min)}
        .max=${String(this.max)}
        @input=${__classPrivateFieldGet(this, _MrSlider_onInput, "f")} />
      <span>${this.value}</span>
    `;
    }
};
_MrSlider_onInput = new WeakMap();
/* ---------- styles ---------- */
Object.defineProperty(MrSlider, "styles", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: css `
    :host { display:inline-block; width:200px; height:32px; }
    .slider { width:100%; }
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
