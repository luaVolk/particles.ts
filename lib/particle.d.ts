import { XY, RGB, HSL } from './utils/interfaces';
import { Particles } from './particles';
export declare class Particle {
    opacity: number;
    particles: Particles;
    position: XY;
    color: {
        value: string;
        rgb: RGB;
        hsl: HSL;
    };
    opacity_bubble: number;
    radius: number;
    radius_bubble: number;
    x: number;
    y: number;
    sizeStatus: boolean;
    opacityStatus: boolean;
    shape: string;
    img: {
        src: string | string[];
        ratio: number;
        loaded: boolean;
        obj: HTMLImageElement;
    };
    character: any;
    vs: number;
    vx: number;
    vy: number;
    vxI: number;
    vyI: number;
    vo: number;
    constructor(opacity: number, particles: Particles, color: string | string[], position?: XY);
    private checkOverlap;
    private drawPolygon;
    drawShape: (shape: string, radius: number, stroke?: boolean) => void;
    private createSvgImg;
    draw: () => void;
}
