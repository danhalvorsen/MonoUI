import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('basic-slider-demo-app')
export class BasicSliderDemoApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      font-family: sans-serif;
    }
    mr-slider, mr-basic {
      margin-bottom: 1.5rem;
      display: block;
    }
  `;

  sliderValue = 50;
  basicValue = 0;

  render() {
  return html`
  <style>
  /* Keeps existing .container uses safe by adding a specific helper class */
  .with-border {
    border: 2px solid #444;   /* adjust color/thickness as needed */
    border-radius: 4px;       /* optional rounded corners */
    padding: 1rem;            /* keeps content from touching the edge */
  }
</style>
    <div class="container with-border">
      <h5>Basic Slider Demo</h5>
      <mr-slider
        .value=${this.sliderValue}
        .min=${0}
        .max=${100}
      ></mr-slider>
    </div>
   
    `;
  }
}
