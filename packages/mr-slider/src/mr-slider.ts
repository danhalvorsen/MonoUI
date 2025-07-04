import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class MrSlider extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      width: 200px;
      height: 32px;
    }
    .slider {
      width: 100%;
    }
  `;

  @property({ type: Number })
  value = 50;

  @property({ type: Number })
  min = 0;

  @property({ type: Number })
  max = 100;

  private onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = Number(input.value);
    this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
  }

  render() {
    return html`
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
}

customElements.define('mr-slider', MrSlider);
