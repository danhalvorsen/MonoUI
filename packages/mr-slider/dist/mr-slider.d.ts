import { LitElement } from 'lit';
export declare class MrSlider extends LitElement {
    static styles: import("lit").CSSResult;
    value: number;
    min: number;
    max: number;
    constructor();
    private onInput;
    render(): import("lit-html").TemplateResult<1>;
}
