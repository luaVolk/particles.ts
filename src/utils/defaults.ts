import { Conf } from './interfaces';

export const defaultConf : Conf = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: '#ffffff'
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 0,
        color: '#ffffff'
      },
      polygon: {
        nb_sides: 5
      },
      character: {
        value: 'P',
        font: 'arial',
        style: 'normal',
        weight: 'normal',
      },
      image: {
        src: 'particle.png',
        width: 100,
        height: 100
      }
    },
    opacity: {
      value: 1,
      random: false,
      anim: {
        enable: false,
        speed: 2,
        opacity_min: 0,
        sync: false
      }
    },
    size: {
      value: 10,
      random: false,
      anim: {
        enable: false,
        speed: 20,
        size_min: 0,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 100,
      color: '#FFFFFF',
      opacity: 1,
      width: 1,
      color_rgb_line: null
    },
    move: {
      enable: true,
      speed: 6,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false,
      parallax: false,
      attract: {
        enable: false,
        rotateX: 3000,
        rotateY: 3000
      }
    },
    array: [],
    tmp: {}
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'grab'
      },
      onclick: {
        enable: true,
        mode: 'push'
      },
      resize: true
    },
    modes: {
      grab:{
        distance: 100,
        line_linked:{
          opacity: 1
        },
        outer_shape: {
          enable: false,
          type: 'inherit',
          size: 20,
          stroke: {
            width: 'inherit',
            color: 'inherit'
          },
        }
      },
      bubble:{
        distance: 100,
        size: 40,
        duration: 0.4,
        opacity: 8,
        speed: 3
      },
      repulse:{
        distance: 200,
        strength: 100,
        duration: 0.4
      },
      push:{
        particles_nb: 4
      },
      remove:{
        particles_nb: 2
      }
    },
    el: null,
    mouse: {},
    status: null
  },
  retina_detect: false,
  fn: {
    interact: {},
    modes: {},
    vendors:{}
  },
  tmp: {}
};