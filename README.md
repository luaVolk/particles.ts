# Particles

Port of [particles](https://github.com/TemplarVolk/particles) which was originally a port of [Vincent Garreau' particles.js](https://github.com/VincentGarreau/particles.js), written in Typescript with added features.

## Instalation

```bash
$ npm install particles.ts
```

Or just [download](https://raw.githubusercontent.com/TemplarVolk/particles.ts/master/dist/particles.min.js) the minified script and add it in your HTML:

```html
<script src="particles.min.js"></script>
```

## Usage

The particle class takes 2 optional arguments: `id` is the element `string`, and `config` which is an object with the settings.

```js
particles = new Particles('id', {/*configuration object*/}).start();
```

You can set only the values you want to change in the configuration object. For example the example below will only change the particles color and use the default settings for everything else.

```js
import {Particles} from 'particles.ts' // If using it as module

particles = new Particles('id', {
  particles: {
    color: {
      value: '#FF0000'
    }
  }
})

particles.start()
```

## Configuration

The default config object looks something like this

```dart
settings = {
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
        color: '#FFFFFF'
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
        src: '',
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
      width: 1
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
    }
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
      grab: {
        distance: 100,
        line_linked: {
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
      bubble: {
        distance: 100,
        size: 40,
        duration: 0.4,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 200,
        strength: 100,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: false
};
```

key | type | default | notes
----|---------|------|------
`particles.number.value` | `number` | `100`
`particles.number.density.enable` | `boolean` | `true`
`particles.number.density.value_area` | `number` | `800`
`particles.color.value` | `string`: Hex or `"random"`<br /> `string[]`: Hex | `#FFFFFF` | Examples: <br /> `"#b61924"` <br /> `["#b61924", "#333333", "999999"]` <br /> `"random"`
`particles.shape.type` | `string` <br /> `string[]` | `"circle"` | Possible values: <br /> `"circle"` <br /> `"edge"` <br /> `"square"` <br /> `"triangle"` <br /> `"polygon"` <br /> `"star"` <br /> `"heart"` <br /> `"character"` <br /> `"char"` <br /> `"image"`
`particles.shape.stroke.width` | `number` | `0`
`particles.shape.stroke.color` | `string` | `"#FF0000"`
`particles.shape.polygon.nb_slides` | `number` | `5`
`particles.shape.character.value` | `string` <br /> `string[]` | `"P"`
`particles.shape.character.font` | `string` | `"arial"`
`particles.shape.character.style` | `string` | `"normal"` | Possible values are the same as in the CSS font-style property
`particles.shape.character.weight` | `string` | `"normal"` | Possible values are the same as in the CSS font-weight property
`particles.shape.image.src` |`string` | `"particle.png"`
`particles.shape.image.width` | `number` | `100`
`particles.shape.image.height` | `number` | `100`
`particles.opacity.value` | `number` | `1` | 0 to 1
`particles.opacity.random` | `boolean` | `false`
`particles.opacity.anim.enable` | `boolean` | `false`
`particles.opacity.anim.speed` | `number` | `2`
`particles.opacity.anim.opacity_min` | `number` | `0` | 0 to 1
`particles.opacity.anim.sync` | `boolean` | `false`
`particles.size.value` | `number` | `10`
`particles.size.random` | `boolean` | `false`
`particles.size.anim.enable` | `boolean` | `false`
`particles.size.anim.speed` | `number` | `20`
`particles.size.anim.size_min` | `number` | `0`
`particles.size.anim.sync` | `boolean` | `false`
`particles.line_linked.enable` | `boolean` | `true`
`particles.line_linked.distance` | `number` | `100`
`particles.line_linked.color` | `string` | `#FFFFFF`
`particles.line_linked.opacity` | `number` | `1` | 0 to 1
`particles.line_linked.width` | `number` | `1`
`particles.move.enable` | `boolean` | `true`
`particles.move.speed` | `number` | `6`
`particles.move.direction` | `string` | `"none"` | Possible values: <br />`"none"` <br /> `"top"` <br /> `"top-right"` <br /> `"right"` <br /> `"bottom-right"` <br /> `"bottom"` <br /> `"bottom-left"` <br /> `"left"` <br /> `"top-left"`
`particles.move.random` | `boolean` |`false`
`particles.move.straight` | `boolean` | `false`
`particles.move.out_mode` | `string` | `"out"` | Possible values: <br /> `"out"` <br /> `"bounce"`
`particles.move.parallax` | `boolean` | `false`
`particles.move.bounce` | `boolean` | `false` | Bounce between particles
`particles.move.attract.enable` | `boolean` |`false`
`particles.move.attract.rotateX` | `number` | `3000`
`particles.move.attract.rotateY` | `number` | `3000`
`interactivity.detect_on` | `string` | `"canvas"` | Possible values: <br /> `"canvas"` <br /> `"window"`
`interactivity.events.onhover.enable` | `boolean` | `true`
`interactivity.events.onhover.mode` | `string` <br /> `string[]` | `"grab"` | Possible values: <br /> `"grab"` <br /> `"bubble"` <br /> `"repulse"`
`interactivity.events.onclick.enable` | `boolean` | `true`
`interactivity.events.onclick.mode` | `string` <br /> `string[]` | `"push"` | Possible values: <br /> `"push"` <br /> `"remove"` <br /> `"bubble"` <br /> `"repulse"`
`interactivity.events.resize` | `boolean` | `true`
`interactivity.events.modes.grab.distance` | `number` | `100`
`interactivity.events.modes.grab.line_linked.opacity` | `number` | `0.75` | 0 to 1
`interactivity.events.modes.grab.outer_shape.enable` | `boolean` | `false`
`interactivity.events.modes.grab.outer_shape.type` | `string` | `"inherit"` | `"inherit"` will use `particles.line_linked` <br /> values <br /> Possible values: <br /> `"inherit"` <br /> `"circle"` <br /> `"edge"` <br /> `"square"` <br /> `"triangle"` <br /> `"polygon"` <br /> `"star"` <br /> `"heart"` <br /> `"character"` <br /> `"char"`
`interactivity.events.modes.grab.outer_shape.size` | `number` | `20` | Added to the particles' size
`interactivity.events.modes.grab.outer_shape.stroke.width` | `string` <br /> `number` | `"inherit"` | `"inherit"` will use `particles.line_linked` values
`interactivity.events.modes.grab.outer_shape.stroke.color` | `string` | `"inherit"` | `"inherit"` will use `particles.line_linked` values
`interactivity.events.modes.bubble.distance` | `number` | `100`
`interactivity.events.modes.bubble.size` | `number` | `40`
`interactivity.events.modes.bubble.duration` | `number` | `0.4` | in seconds
`interactivity.events.modes.repulse.strength` | `number` | `100`
`interactivity.events.modes.repulse.distance` | `number` | `200`
`interactivity.events.modes.repulse.duration` | `number` | `0.4` | in seconds
`interactivity.events.modes.push.particles_nb` | `number` | `4`
`interactivity.events.modes.push.particles_nb` | `number` | `2`
`retina_detect` | `boolean` | `false`

-------------------------------
