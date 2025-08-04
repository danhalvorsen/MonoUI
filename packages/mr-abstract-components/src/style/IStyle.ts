export interface IVisualStyle {
    visible: boolean;
    opacity: number;
    zIndex: number;
    style?: {
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
    };
}
