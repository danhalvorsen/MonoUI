import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mr-slider')
export class MrSlider extends LitElement {
  @property({ type: Number })
  value = 50;

  @property({ type: Number })
  min = 0;

  @property({ type: Number })
  max = 100;

  static styles = css`
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

  #onInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.value = Number(target.value);
    this.dispatchEvent(new CustomEvent('change', { 
      detail: this.value,
      bubbles: true 
    }));
  };

  render() {
    return html`
      <input 
        class="slider" 
        type="range"
        .value=${String(this.value)}
        .min=${String(this.min)}
        .max=${String(this.max)}
        @input=${this.#onInput} 
      />
      <span class="value-display">${this.value}</span>
    `;
  }
}