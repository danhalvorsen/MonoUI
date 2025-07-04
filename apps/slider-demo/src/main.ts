import 'mr-slider/dist/mr-slider.js';

const template = document.createElement('template');
template.innerHTML = `
  <h1>Slider Demo</h1>
  <mr-slider id="slider"></mr-slider>
  <div>Value: <span id="value">50</span></div>
`;

document.body.appendChild(template.content.cloneNode(true));

const slider = document.getElementById('slider');
const valueSpan = document.getElementById('value');

if (slider && valueSpan) {
  slider.addEventListener('change', (e) => {
    valueSpan.textContent = e.detail;
  });
}
