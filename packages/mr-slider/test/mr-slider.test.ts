import { fixture, html, expect } from '@open-wc/testing';
import '../src/mr-slider.js';

describe('<mr-slider>', () => {
  it('has default value of 50', async () => {
    const el = await fixture(html`<mr-slider></mr-slider>`);
    expect(el.value).to.equal(50);
  });

  it('reflects value change on input', async () => {
    const el = await fixture(html`<mr-slider></mr-slider>`);
    const input = el.shadowRoot.querySelector('input');
    input.value = '75';
    input.dispatchEvent(new InputEvent('input'));
    expect(el.value).to.equal(75);
  });
});