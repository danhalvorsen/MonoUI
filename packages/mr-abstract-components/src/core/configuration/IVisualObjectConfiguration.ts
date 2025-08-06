export interface IVisualObjectConfiguration {
    id: string; 
    visual: {
        visible: boolean;
        opacity: number;
        zIndex: number;
        style: {
            fill: string;
            stroke: string;
            strokeWidth: number;
        };
    };

    interaction: {
        draggable: boolean;
        selected: boolean;
    };

    connectors: any[];

    /** Optional precomputed style values (filled by mr-style-cli) */
    resolvedStyles?: {
        fillStyle?: string;
        strokeStyle?: string;
        lineWidth?: number;
        opacity?: number;
    };
}