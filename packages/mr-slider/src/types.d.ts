declare namespace JSX {
  interface IntrinsicElements {
    'mr-slider': {
      value?: number;
      min?: number | string;
      max?: number | string;
      step?: number | string;
      disabled?: boolean;
      // Add any other properties your component might have
    } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mr-slider': MrSliderElement;
  }
}

interface MrSliderElement extends HTMLElement {
  value: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  // Add any other methods or properties your component has
}
