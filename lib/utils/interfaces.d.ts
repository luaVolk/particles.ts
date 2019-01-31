export interface Conf {
    particles: {
        number: {
            value: number;
            density: {
                enable: boolean;
                value_area: number;
            };
        };
        color: {
            value: string | Array<string>;
        };
        shape: Shape;
        opacity: {
            value: number;
            random: boolean;
            anim: {
                enable: boolean;
                speed: number;
                opacity_min: number;
                sync: boolean;
            };
        };
        size: {
            value: number;
            random: boolean;
            anim: {
                enable: boolean;
                speed: number;
                size_min: number;
                sync: boolean;
            };
        };
        line_linked: {
            enable: boolean;
            distance: number;
            color: string;
            opacity: number;
            width: number;
            color_rgb_line: any;
        };
        move: {
            enable: boolean;
            speed: number;
            direction: string;
            random: boolean;
            straight: boolean;
            out_mode: string;
            bounce: boolean;
            parallax: boolean;
            attract: {
                enable: boolean;
                rotateX: number;
                rotateY: number;
            };
        };
        array: Array<any>;
        tmp: any;
    };
    interactivity: {
        detect_on: string;
        events: {
            onhover: {
                enable: boolean;
                mode: string | Array<string>;
            };
            onclick: {
                enable: boolean;
                mode: string | Array<string>;
            };
            resize: boolean;
        };
        modes: {
            grab: {
                distance: number;
                line_linked: {
                    opacity: number;
                };
                outer_shape: {
                    enable: boolean;
                    type: string;
                    size: number;
                    stroke: {
                        width: string | number;
                        color: string;
                    };
                };
            };
            bubble: {
                distance: number;
                size: number;
                duration: number;
                opacity: number;
                speed: number;
            };
            repulse: {
                distance: number;
                strength: number;
                duration: number;
            };
            push: {
                particles_nb: number;
            };
            remove: {
                particles_nb: number;
            };
        };
        el: any;
        mouse: any;
        status: any;
    };
    retina_detect: false;
    fn: {
        interact: any;
        modes: any;
        vendors: any;
    };
    tmp: any;
}
export interface Shape {
    type: string | string[];
    stroke: {
        width: number;
        color: string;
    };
    polygon: {
        nb_sides: 5;
    };
    character: {
        value: string | string[];
        font: string;
        style: string;
        weight: string;
    };
    image: {
        src: string;
        width: number;
        height: number;
    };
}
export interface RGB {
    r: number;
    g: number;
    b: number;
}
export interface HSL {
    h: number;
    s: number;
    l: number;
}
export interface XY {
    x: number;
    y: number;
}
