import { IVisualObjectConfiguration } from "./../../abstractions/IVisualObjectConfiguration.js";

export interface IVisualAxisConfiguration extends IVisualObjectConfiguration {
    /** Whether to show the axis line */
    showAxis: boolean;

    /** Color of the axis line */
    color: string;

    /** Width of the axis line */
    lineWidth: number;

    /** Whether to show tick marks */
    showTicks: boolean;

    /** Spacing between tick marks */
    tickSpacing: number;

    /** Whether to show labels */
    showLabels: boolean;
}
