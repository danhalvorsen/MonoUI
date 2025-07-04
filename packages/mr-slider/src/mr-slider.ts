import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mr-slider')
export class MrSlider extends LitElement {
  /* ---------- styles ---------- */
  static styles = css`
    :host { display:inline-block; width:200px; height:32px; }
    .slider { width:100%; }
  `;

  /* ---------- reactive props (shadow-safe) ---------- */
  
  @property({ type: Number, reflect: true })
  value = 50;

  @property({ type: Number, reflect: true })
  min = 0;

  @property({ type: Number, reflect: true })
  max = 100;

  // No need for constructor unless you have custom logic

  /* ---------- events ---------- */
  #onInput = (e: Event) => {
    this.value = Number((e.target as HTMLInputElement).value);
    this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
  };

  /* ---------- render ---------- */
  render() {
    console.log('render mr-slider', this.value, this.min, this.max);    
    return html`
      <input class="slider" type="range"
        .value=${String(this.value)}
        .min=${String(this.min)}
        .max=${String(this.max)}
        @input=${this.#onInput} />
      <span>${this.value}</span>
    `;
  }
}
