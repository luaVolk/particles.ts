import { Conf, DeepPartial } from './utils/interfaces';
export declare class Particles {
    id: string;
    config: DeepPartial<Conf>;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    canvasWidth: number;
    canvasHeight: number;
    pxratio: number;
    settings: Conf;
    constructor(id?: string, config?: DeepPartial<Conf>);
    start: () => Particles;
    private retinaInit;
    private createCanvas;
    private canvasSize;
    private canvasPaint;
    private canvasClear;
    private particlesCreate;
    private particlesUpdate;
    private particlesDraw;
    private particlesEmpty;
    particlesRefresh: (config?: DeepPartial<Conf>) => void;
    private linkParticles;
    private attractParticles;
    private bounceParticles;
    pushParticles: (nb: number, pos?: any) => void;
    removeParticles: (nb: number) => void;
    private bubbleParticle;
    private repulseParticle;
    private grabParticle;
    private eventsListeners;
    private densityAutoParticles;
    destroyParticles: () => void;
    exportImg: () => void;
    private loadImg;
    private drawAnimFrame;
    /**
     * A function that will run every frame.
     * Meant to be replaced with another function
     */
    everyFrame: Function;
    private draw;
    private checkBeforeDraw;
    private init;
    private begin;
}
