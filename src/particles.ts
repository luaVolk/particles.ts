import { randomInt, randomFloat, hexToRgb, deepExtend, clamp, isInArray } from './utils/utils';
import { Conf, XY, RGB } from './utils/interfaces';
import { defaultConf } from './utils/defaults';
import { Particle } from './particle';

export class Particles {

  /// The id of the element that will contain the particles' [canvas]
  // public id : string;

  /// The canvas where the particles will be drawn
  public canvas : HTMLCanvasElement;

  /// The context of the [canvas] where the particles will be drawn
  public ctx : CanvasRenderingContext2D;

  /// The width of the [canvas] where the particles will be drawn
  public canvasWidth : number;

  /// The height of the [canvas] where the particles will be drawn
  public canvasHeight : number;

  public pxratio : number;

  public settings : Conf = defaultConf;

  constructor(public id : string = 'particles', public config : Map<string, any> = null) {
    return this;
  }

  start = () : Particles => {
    this.createCanvas();

    if (this.config) {
      this.settings = deepExtend(this.settings, this.config);
    }

    this.eventsListeners();

    this.begin();

    return this;
  }

  private retinaInit = () : void => {
    if (this.settings.retina_detect && window.devicePixelRatio > 1) {
      this.pxratio = window.devicePixelRatio;
      this.settings.tmp.retina = true;
    } else {
      this.pxratio = 1;
      this.settings.tmp.retina = false;
    }

    this.canvasWidth = this.canvas.offsetWidth * this.pxratio;
    this.canvasHeight = this.canvas.offsetHeight * this.pxratio;

    this.settings.particles.size.value = this.settings.tmp.obj.size_value * this.pxratio;
    this.settings.particles.size.anim.speed = this.settings.tmp.obj.size_anim_speed * this.pxratio;
    this.settings.particles.move.speed = this.settings.tmp.obj.move_speed * this.pxratio;
    this.settings.particles.line_linked.distance = this.settings.tmp.obj.line_linked_distance * this.pxratio;
    this.settings.interactivity.modes.grab.distance = this.settings.tmp.obj.mode_grab_distance * this.pxratio;
    this.settings.interactivity.modes.bubble.distance = this.settings.tmp.obj.mode_bubble_distance * this.pxratio;
    this.settings.particles.line_linked.width = this.settings.tmp.obj.line_linked_width * this.pxratio;
    this.settings.interactivity.modes.bubble.size = this.settings.tmp.obj.mode_bubble_size * this.pxratio;
    this.settings.interactivity.modes.repulse.distance = this.settings.tmp.obj.mode_repulse_distance * this.pxratio;
  }

    /* ---------- Particles functions - canvas ------------ */

    private createCanvas = () : void => {

    if (this.id == null) {
      this.id = 'particles';
    }

    let tag : HTMLElement = document.getElementById(this.id);
    let canvasClass : string = 'particles-ts-canvas-el';
    let existCanvas : HTMLCollectionOf<Element> = tag.getElementsByClassName(canvasClass);

    if (existCanvas.length > 0) {
      while (existCanvas.length > 0) {
        existCanvas[0].remove();
      }
    }

    let canvasEl : HTMLCanvasElement = document.createElement('canvas');
    canvasEl.className = canvasClass;

    canvasEl.style.width = "100%";
    canvasEl.style.height = "100%";

    this.canvas = tag.appendChild(canvasEl);

    this.canvas = document.querySelector(`#${this.id} > .particles-ts-canvas-el`);

    this.ctx = this.canvas.getContext('2d');
  }

  private canvasSize = () : void => {
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    if (this.settings != null && this.settings.interactivity.events.resize) {
      window.addEventListener('resize', (_) => {
        this.canvasWidth = this.canvas.offsetWidth;
        this.canvasHeight = this.canvas.offsetHeight;

        if ('retina' in this.settings.tmp && this.settings.tmp.retina) {
          this.canvasWidth *= this.pxratio;
          this.canvasHeight *= this.pxratio;
        }

        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;

        if (!this.settings.particles.move.enable) {
          this.particlesEmpty();
          this.particlesCreate();
          this.particlesDraw();
          this.densityAutoParticles();
        }

        this.densityAutoParticles();
      });
    }
  }

  private canvasPaint = () : void => {
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private canvasClear = () : void => {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private particlesCreate = () : void => {
    for (let i : number = 0; i < this.settings.particles.number.value; i++) {
      this.settings.particles.array.push(new Particle(
        this.settings.particles.opacity.value,
        this,
        this.settings.particles.color.value
      ));
    }
    this.settings.particles.array.sort((a : Particle, b : Particle) => a.radius > b.radius ? 1 : -1);
  }


  private particlesUpdate = () : void => {
    for (let i = 0; i < this.settings.particles.array.length; i++) {

      let p : Particle =this.settings.particles.array[i];


      if (this.settings.particles.move.enable) {
        let ms : number = this.settings.particles.move.speed / 2;
        p.x += p.vx * ms;
        p.y += p.vy * ms;
      }

      if (this.settings.particles.opacity.anim.enable) {
        if (p.opacityStatus == true) {
          if (p.opacity >= this.settings.particles.opacity.value) {
            p.opacityStatus = false;
          }
          p.opacity += p.vo;
        } else {
          if (p.opacity <= this.settings.particles.opacity.anim.opacity_min) {
            p.opacityStatus = true;
          }
          p.opacity -= p.vo;
        }

        if (p.opacity < 0) p.opacity = 0;
      }

      if (this.settings.particles.size.anim.enable) {
        if (p.sizeStatus == true) {
          if (p.radius >= this.settings.particles.size.value) {
            p.sizeStatus = false;
          }
          p.radius += p.vs;
        } else {
          if (p.radius <= this.settings.particles.size.anim.size_min) {
            p.sizeStatus = true;
          }
          p.radius -= p.vs;
        }

        if (p.radius < 0) p.radius = 0;
      }

      let new_pos : {
        x_left: number,
        x_right: number,
        y_top: number,
        y_bottom: number
      };
      if (this.settings.particles.move.out_mode == 'bounce') {
        new_pos = {
          x_left: p.radius,
          x_right: this.canvasWidth,
          y_top: p.radius,
          y_bottom: this.canvasHeight
        };
      } else {
        new_pos = {
          x_left: -p.radius,
          x_right: this.canvasWidth + p.radius,
          y_top: -p.radius,
          y_bottom: this.canvasHeight + p.radius
        };
      }

      if (p.x - p.radius > this.canvasWidth) {
        p.x = new_pos.x_left;
        p.y = randomFloat() * this.canvasHeight;
      } else if (p.x + p.radius < 0) {
        p.x = new_pos.x_right;
        p.y = randomFloat() * this.canvasHeight;
      }
      if (p.y - p.radius > this.canvasHeight) {
        p.y = new_pos.y_top;
        p.x = randomFloat() * this.canvasWidth;
      } else if (p.y + p.radius < 0) {
        p.y = new_pos.y_bottom;
        p.x = randomFloat() * this.canvasWidth;
      }

      /* out of canvas modes */
      switch (this.settings.particles.move.out_mode) {
        case 'bounce':
          if (p.x + p.radius > this.canvasWidth) {
            p.vx = -p.vx;
          } else if (p.x - p.radius < 0) {
            p.vx = -p.vx;
          }
          if (p.y + p.radius > this.canvasHeight) {
            p.vy = -p.vy;
          } else if (p.y - p.radius < 0) {
           p.vy = -p.vy;
          }
        break;
      }

      if (isInArray('grab', this.settings.interactivity.events.onhover.mode)) {
        this.grabParticle(p);
      }

      if (isInArray('bubble', this.settings.interactivity.events.onhover.mode) || isInArray('bubble', this.settings.interactivity.events.onclick.mode)) {
        this.bubbleParticle(p);
      }

      if (isInArray('repulse', this.settings.interactivity.events.onhover.mode) || isInArray('repulse', this.settings.interactivity.events.onclick.mode)) {
        this.repulseParticle(p);
      }

      if (this.settings.particles.line_linked.enable ||
          this.settings.particles.move.attract.enable ||
          this.settings.particles.move.bounce) {
        for (let j = i + 1; j < this.settings.particles.array.length; j++) {
          let p2 : Particle = this.settings.particles.array[j];

          if (this.settings.particles.line_linked.enable) {
            this.linkParticles(p, p2);
          }

          if (this.settings.particles.move.attract.enable) {
            this.attractParticles(p, p2);
          }

          if (this.settings.particles.move.bounce) {
            this.bounceParticles(p, p2);
          }
        }
      }
    }
  }

  private particlesDraw = () : void => {

    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.particlesUpdate();

    for (let i = 0; i < this.settings.particles.array.length; i++) {
      let p : Particle = this.settings.particles.array[i];
      p.draw();
    }
  }

  private particlesEmpty = () : void => {
    this.settings.particles.array = [];
  }


  public particlesRefresh = (config : Map<string, any> = null) : void => {
    window.cancelAnimationFrame(this.settings.tmp.checkAnimFrame);
    window.cancelAnimationFrame(this.drawAnimFrame);
    this.settings.tmp.source_svg = null;
    this.settings.tmp.img_obj = null;
    this.settings.tmp.count_svg = 0;
    this.particlesEmpty();
    this.canvasClear();

    if (config) {
      this.settings = deepExtend(this.settings, config);
    }

    /* restart */
    this.begin();
  }

  private linkParticles = (p1 : Particle, p2 : Particle) : void => {
    let dx : number = p1.x - p2.x, dy = p1.y - p2.y;
    let dist : number = Math.sqrt(dx * dx + dy * dy);

    if (dist <= this.settings.particles.line_linked.distance) {
      let opacity_line : number = this.settings.particles.line_linked.opacity -
          (dist / (1 / this.settings.particles.line_linked.opacity)) /
              this.settings.particles.line_linked.distance;

      if (opacity_line > 0) {
        let color_line : RGB = this.settings.particles.line_linked.color_rgb_line;
        this.ctx.strokeStyle = `rgba(${color_line.r},${color_line.g},${color_line.b},${opacity_line})`;
        this.ctx.lineWidth = this.settings.particles.line_linked.width;

        /* path */
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  }

  private attractParticles = (p1 : Particle, p2 : Particle) : void => {
    let dx : number = p1.x - p2.x, dy = p1.y - p2.y;

    let dist : number = Math.sqrt(dx * dx + dy * dy);

    if (dist <= this.settings.particles.line_linked.distance) {
      let ax : number = dx / (this.settings.particles.move.attract.rotateX * 1000),
          ay = dy / (this.settings.particles.move.attract.rotateY * 1000);

      p1.vx -= ax;
      p1.vy -= ay;

      p2.vx += ax;
      p2.vy += ay;
    }
  }

  private bounceParticles = (p1 : Particle, p2 : Particle) : void => {
    let dx : number = p1.x - p2.x, dy = p1.y - p2.y, dist_p = p1.radius + p2.radius;

    let dist : number = Math.sqrt(dx * dx + dy * dy);

    if (dist <= dist_p) {
      p1.vx = -p1.vx;
      p1.vy = -p1.vy;

      p2.vx = -p2.vx;
      p2.vy = -p2.vy;
    }
  }

  /// Adds a specified amount of particles
  public pushParticles = (nb : number, pos = null) : void => {
    
    this.settings.particles.tmp.pushing = true;

    for (let i = 0; i < nb; i++) {
      this.settings.particles.array.push(new Particle(
        this.settings.particles.opacity.value,
        this,
        this.settings.particles.color.value,
        {
          'x': pos != null ? pos.pos_x : randomFloat() * this.canvasWidth,
          'y': pos != null ? pos.pos_y : randomFloat() * this.canvasHeight
        }
      ));
      if (i == nb - 1) {
        if (!this.settings.particles.move.enable) {
          this.particlesDraw();
        }
        this.settings.particles.tmp.pushing = false;
      }
    }
    this.settings.particles.array.sort((a : Particle, b : Particle) => a.radius > b.radius ? 1 : -1);
  }

  /* ---------- Particles functions - modes events ------------ */

  public removeParticles = (nb : number) : void => {
    this.settings.particles.array.splice(0, nb);
    if (!this.settings.particles.move.enable) {
      this.particlesDraw();
    }
  }

  private bubbleParticle = (p : Particle) : void => {
    let dist_mouse : number, time_spent : number, value : number;

    if (this.settings.interactivity.events.onhover.enable &&
        isInArray('bubble', this.settings.interactivity.events.onhover.mode ) &&
        this.settings.interactivity.status == 'mousemove') {
      let dx_mouse : number = p.x - this.settings.interactivity.mouse.pos_x,
          dy_mouse = p.y - this.settings.interactivity.mouse.pos_y;
      dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);

      let ratio : number = 1 -
          dist_mouse / this.settings.interactivity.modes.bubble.distance;

      let init = () => {
        p.opacity_bubble = p.opacity;
        p.radius_bubble = p.radius;
      }

      if (dist_mouse <= this.settings.interactivity.modes.bubble.distance) {
        if (ratio >= 0 && this.settings.interactivity.status == 'mousemove') {
  
          if (this.settings.interactivity.modes.bubble.size != this.settings.particles.size.value) {
            if (this.settings.interactivity.modes.bubble.size > this.settings.particles.size.value) {
              var size = p.radius + (this.settings.interactivity.modes.bubble.size * ratio);
              if (size >= 0) {
                p.radius_bubble = size;
              }
            } else {
              var dif = p.radius - this.settings.interactivity.modes.bubble.size,
                  size = p.radius - (dif * ratio);
              if (size > 0) {
                p.radius_bubble = size;
              } else {
                p.radius_bubble = 0;
              }
            }
          }

          if (this.settings.interactivity.modes.bubble.opacity != this.settings.particles.opacity.value) {
            if (this.settings.interactivity.modes.bubble.opacity > this.settings.particles.opacity.value) {
              let opacity : number = this.settings.interactivity.modes.bubble .opacity * ratio;
              if (opacity > p.opacity &&
                  opacity <= this.settings.interactivity.modes.bubble.opacity) {
                p.opacity_bubble = opacity;
              }
            } else {
              let opacity : number = p.opacity - (this.settings.particles.opacity.value - this.settings.interactivity.modes.bubble.opacity) * ratio;
              if (opacity < p.opacity &&
                  opacity >= this.settings.interactivity.modes.bubble.opacity) {
                p.opacity_bubble = opacity;
              }
            }
          }
        }
      } else {
        init();
      }

      if (this.settings.interactivity.status == 'mouseleave') {
        init();
      }
    }

    else if (this.settings.interactivity.events.onclick.enable && isInArray('bubble', this.settings.interactivity.events.onclick.mode)) {
      if (this.settings.tmp.bubble_clicking) {
      var dx_mouse = p.x - this.settings.interactivity.mouse.click_pos_x,
          dy_mouse = p.y - this.settings.interactivity.mouse.click_pos_y;
        dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);
        time_spent = (Date.now() - this.settings.interactivity.mouse.click_time) / 1000;

        if (time_spent > this.settings.interactivity.modes.bubble.duration) {
          this.settings.tmp.bubble_duration_end = true;
        }

        if (time_spent > this.settings.interactivity.modes.bubble.duration * 2) {
          this.settings.tmp.bubble_clicking = false;
          this.settings.tmp.bubble_duration_end = false;
        }
      }

      let process = (
        bubble_param : number,
        particles_param : number,
        p_obj_bubble : number,
        p_obj : number,
        id : string,
        dist_mouse : number,
        time_spent : number,
        value : number
      ) : void => {
        if (bubble_param != particles_param) {
          if (!this.settings.tmp.bubble_duration_end) {
            if (dist_mouse <= this.settings.interactivity.modes.bubble.distance) {
              let obj : number;
              if (p_obj_bubble != null) {
                obj = p_obj_bubble;
              } else {
                obj = p_obj;
              }
              if (obj != bubble_param) {
                let value : number = p_obj - (time_spent * (p_obj - bubble_param) / this.settings.interactivity.modes.bubble .duration);
                if (id == 'size') p.radius_bubble = value;
                if (id == 'opacity') p.opacity_bubble = value;
              }
            } else {
              if (id == 'size') p.radius_bubble = null;
              if (id == 'opacity') p.opacity_bubble = null;
            }
          } else {
            if (p_obj_bubble != null) {
              let value_tmp : number = p_obj - (time_spent * (p_obj - bubble_param) / this.settings.interactivity.modes.bubble .duration),
                  dif = bubble_param - value_tmp;
                  value = bubble_param + dif;
              if (id == 'size') p.radius_bubble = value;
              if (id == 'opacity') p.opacity_bubble = value;
            }
            }
          }
        };

      if (this.settings.tmp.bubble_clicking) {
        process(
          this.settings.interactivity.modes.bubble.size,
          this.settings.particles.size.value,
          p.radius_bubble,
          p.radius,
          'size',
          dist_mouse,
          time_spent,
          value
        );
        process(
          this.settings.interactivity.modes.bubble.opacity,
          this.settings.particles.opacity.value,
          p.opacity_bubble,
          p.opacity,
          'opacity',
          dist_mouse,
          time_spent,
          value
        );
      }
    }
  }

  private repulseParticle = (p : Particle) : void => {

    if (this.settings.interactivity.events.onhover.enable &&
        isInArray('repulse', this.settings.interactivity.events.onhover.mode) &&
        this.settings.interactivity.status == 'mousemove') {
          
      let dx_mouse : number = p.x - this.settings.interactivity.mouse.pos_x,
          dy_mouse = p.y - this.settings.interactivity.mouse.pos_y;
      let dist_mouse : number = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);

      let normVec : XY = {
        'x': dx_mouse / dist_mouse,
        'y': dy_mouse / dist_mouse
      };

      var repulseRadius = this.settings.interactivity.modes.repulse.distance,
          velocity = this.settings.interactivity.modes.repulse.strength,
          repulseFactor = clamp(
            (1 / repulseRadius) * (-1 * Math.pow(dist_mouse / repulseRadius, 2) + 1) * repulseRadius * velocity,
            0,
            50
          );

      let pos : XY = {
        'x': p.x + normVec.x * repulseFactor,
        'y': p.y + normVec.y * repulseFactor
      };

      if (this.settings.particles.move.out_mode == 'bounce') {
        if (pos.x - p.radius > 0 && pos.x + p.radius < this.canvasWidth)
          p.x = pos.x;
        if (pos.y - p.radius > 0 && pos.y + p.radius < this.canvasHeight)
          p.y = pos.y;
      } else {
        p.x = pos.x;
        p.y = pos.y;
      }
    } else if (this.settings.interactivity.events.onclick.enable &&
               isInArray('repulse', this.settings.interactivity.events.onclick.mode)) {
      if (!this.settings.tmp.repulse_finish != null &&
          this.settings.tmp.repulse_finish) {
        this.settings.tmp.repulse_count++;
        if (this.settings.tmp.repulse_count == this.settings.particles.array.length) {
          this.settings.tmp.repulse_finish = true;
        }
      }

      if (this.settings.tmp.repulse_clicking) {
        let repulseRadius : number = Math.pow(this.settings.interactivity.modes.repulse.distance / 6, 3);

        let dx : number = this.settings.interactivity.mouse.click_pos_x - p.x;
        let dy : number = this.settings.interactivity.mouse.click_pos_y - p.y;
        let d : number= dx * dx + dy * dy;

        let force : number = -repulseRadius / d * 1;

        let process = () : void => {
          let f : number = Math.atan2(dy, dx);
          p.vx = force * Math.cos(f);
          p.vy = force * Math.sin(f);

          if (this.settings.particles.move.out_mode == 'bounce') {
            let pos : XY = {'x': p.x + p.vx, 'y': p.y + p.vy};
            if (pos.x + p.radius > this.canvasWidth) {
              p.vx = -p.vx;
            }
            else if (pos.x - p.radius < 0) p.vx = -p.vx;
            if (pos.y + p.radius > this.canvasHeight) {
              p.vy = -p.vy;
            } else if (pos.y - p.radius < 0) {
              p.vy = -p.vy;
            }
          }
        }

        if (d <= repulseRadius) {
          process();
        }

      } else {
        if (this.settings.tmp.repulse_clicking == false) {
          p.vx = p.vxI;
          p.vy = p.vyI;
        }
      }
    }
  }

  private grabParticle = (p : Particle) : void => {
    if (this.settings.interactivity.events.onhover.enable &&
        isInArray('grab', this.settings.interactivity.events.onhover.mode) &&
        this.settings.interactivity.status == 'mousemove') {
      let dx_mouse : number = p.x - this.settings.interactivity.mouse.pos_x,
          dy_mouse = p.y - this.settings.interactivity.mouse.pos_y,
          dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);

      if (dist_mouse <= this.settings.interactivity.modes.grab.distance) {
        let opacity_line : number = this.settings.interactivity.modes.grab.line_linked.opacity -
            (dist_mouse / (1 / this.settings.interactivity.modes.grab .line_linked.opacity)) / this.settings.interactivity.modes.grab.distance;

        if (opacity_line > 0) {
          let color_line : RGB = this.settings.particles.line_linked.color_rgb_line;
          this.ctx.strokeStyle = `rgba(${color_line.r},${color_line.g},${color_line.b},${opacity_line})`;
          this.ctx.lineWidth = this.settings.particles.line_linked.width;

          /* path */
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.settings.interactivity.mouse.pos_x, this.settings.interactivity.mouse.pos_y);
          this.ctx.stroke();
          this.ctx.closePath();

          if (this.settings.interactivity.modes.grab.outer_shape.enable) {
            this.ctx.beginPath();

            let shape : string;
            if (this.settings.interactivity.modes.grab.outer_shape.type != 'inherit') {
              shape = this.settings.interactivity.modes.grab.outer_shape.type;
            } else {
              shape = p.shape;
            }

            if (this.settings.interactivity.modes.grab.outer_shape.stroke.color != 'inherit') {
              let color : RGB = hexToRgb(this.settings.interactivity.modes.grab.outer_shape.stroke.color);
              this.ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${opacity_line})`;
            }

            if (this.settings.interactivity.modes.grab.outer_shape.stroke.width != 'inherit') {
              this.ctx.lineWidth = (this.settings.interactivity.modes.grab.outer_shape.stroke.width as number);
            }

            p.drawShape(shape, this.settings.interactivity.modes.grab.outer_shape.size + p.radius, true);

            this.ctx.stroke();
            this.ctx.closePath();
          }
        }
      }
    }
  }

  private eventsListeners = () : void => {
    if (this.settings.interactivity.detect_on == 'window') {
      this.settings.interactivity.el = window;
    } else {
      this.settings.interactivity.el = this.canvas;
    }

    if (this.settings.interactivity.events.onhover.enable ||
        this.settings.interactivity.events.onclick.enable) {

      this.settings.interactivity.el.addEventListener('mousemove', (e : MouseEvent) => {
        
        let pos_x : number = e.clientX, pos_y = e.clientY;

        if (this.settings.interactivity.detect_on == 'window') {
          pos_x = e.clientX;
          pos_y = e.clientY;
        } else {
          pos_x = e.offsetX || e.clientX;
          pos_y = e.offsetY || e.clientY;
        }

        this.settings.interactivity.mouse.pos_x = pos_x;
        this.settings.interactivity.mouse.pos_y = pos_y;

        if (this.settings.tmp.retina) {
          this.settings.interactivity.mouse.pos_x *= this.pxratio;
          this.settings.interactivity.mouse.pos_y *= this.pxratio;
        }

        this.settings.interactivity.status = 'mousemove';
      });

      this.settings.interactivity.el.addEventListener('mouseleave', (e) => {
        this.settings.interactivity.mouse.pos_x = null;
        this.settings.interactivity.mouse.pos_y = null;
        this.settings.interactivity.status = 'mouseleave';
      });
    }

    if (this.settings.interactivity.events.onclick.enable) {
      this.settings.interactivity.el.addEventListener('click', (e) => {
        this.settings.interactivity.mouse.click_pos_x = this.settings.interactivity.mouse.pos_x;
        this.settings.interactivity.mouse.click_pos_y = this.settings.interactivity.mouse.pos_y;
        this.settings.interactivity.mouse.click_time = Date.now();
        
        if (this.settings.interactivity.events.onclick.enable) {
          if (isInArray('push', this.settings.interactivity.events.onclick.mode)) {
            if (this.settings.particles.move.enable) {
              this.pushParticles(this.settings.interactivity.modes.push.particles_nb, this.settings.interactivity.mouse);
            } else {
              if (this.settings.interactivity.modes.push.particles_nb == 1) {
                this.pushParticles(this.settings.interactivity.modes.push.particles_nb, this.settings.interactivity.mouse);
              } else if (this.settings.interactivity.modes.push.particles_nb > 1) {
                this.pushParticles(this.settings.interactivity.modes.push.particles_nb);
              }
            }
          }

          if (isInArray('remove', this.settings.interactivity.events.onclick.mode)) {
            this.removeParticles(this.settings.interactivity.modes.remove.particles_nb);
          }

          if (isInArray('bubble', this.settings.interactivity.events.onclick.mode)) {
            this.settings.tmp.bubble_clicking = true;
          }

          if (isInArray('repulse', this.settings.interactivity.events.onclick.mode)) {
            this.settings.tmp.repulse_clicking = true;
            this.settings.tmp.repulse_count = 0;
            this.settings.tmp.repulse_finish = false;
            setTimeout(() => {
              this.settings.tmp.repulse_clicking = false;
            }, Math.round(this.settings.interactivity.modes.repulse.duration * 1000));
          }
        }
      });
    }
  }

  private densityAutoParticles = () : void => {
    if (this.settings.particles.number.density.enable) {
      let area : number = this.canvas.width * this.canvas.height / 1000;
      if (this.settings.tmp.retina) {
        area = area / (this.pxratio * 2);
      }

      let nb_particles : number = Math.floor(area * this.settings.particles.number.value / this.settings.particles.number.density.value_area);

      let missing_particles : number = this.settings.particles.array.length - nb_particles;
      if (missing_particles < 0) {
        this.pushParticles(Math.abs(missing_particles));
      } else {
        this.removeParticles(missing_particles);
      }
    }
  }

  /// Stops drawing the particles and removes the [canvas]
  public destroyParticles = () : void => {
    window.cancelAnimationFrame(this.drawAnimFrame);
    this.canvas.remove();
  }

  /// Opens the current image displaying in the [canvas] in a new tab
  public exportImg = () : void => {
    window.open(this.canvas.toDataURL('image/png'), '_blank');
  }

  private loadImg = (type : string) : void => {
    this.settings.tmp.img_error = null;

    if (this.settings.particles.shape.image.src != '') {
      if (type == 'svg') {
        let req : XMLHttpRequest = new XMLHttpRequest;
        req.open('GET', this.settings.particles.shape.image.src);
        req.addEventListener('onreadystatechange', (data) => {
          if (req.readyState == 4) {
            if (req.status == 200) {
              this.settings.tmp.source_svg = req.response;
              this.checkBeforeDraw();
            } else {
              console.log('Error Particles - Image not found');
              this.settings.tmp.img_error = true;
            }
          }
        });
        req.send();
      } else {
        let img : HTMLImageElement = new Image();
        img.addEventListener('load', (e) => {
          this.settings.tmp.img_obj = img;
          this.checkBeforeDraw();
        });
        img.src = this.settings.particles.shape.image.src;
      }
    } else {
      console.log('Error Particles - No image.src');
      this.settings.tmp.img_error = true;
    }
  }

  private drawAnimFrame : number;

  /**
   * A function that will run every frame.
   * Meant to be replaced with another function
   */
  everyFrame : Function = () => {};

  private draw = (_ = null) : void => {
    if (this.settings.particles.shape.type == 'image') {
      if (this.settings.tmp.img_type == 'svg') {
        if (this.settings.tmp.count_svg >=
            this.settings.particles.number.value) {
          this.particlesDraw();
          if (!this.settings.particles.move.enable) {
            window.cancelAnimationFrame(this.drawAnimFrame);
          } else {
            this.drawAnimFrame = window.requestAnimationFrame(this.draw);
          }
        } else {
          if (!this.settings.tmp.img_error) {
            this.drawAnimFrame = window.requestAnimationFrame(this.draw);
          }
        }
      } else {
        if (this.settings.tmp.img_obj != null) {
          this.particlesDraw();
          if (!this.settings.particles.move.enable) {
            window.cancelAnimationFrame(this.drawAnimFrame);
          } else {
            this.drawAnimFrame = window.requestAnimationFrame(this.draw);
          }
        } else {
          if (!this.settings.tmp.img_error) {
            this.drawAnimFrame = window.requestAnimationFrame(this.draw);
          }
        }
      }
    } else {
      this.particlesDraw();
      if (!this.settings.particles.move.enable) {
        window.cancelAnimationFrame(this.drawAnimFrame);
      } else {
        this.drawAnimFrame = window.requestAnimationFrame(this.draw);
      }
    }

    this.everyFrame();
  }

  private checkBeforeDraw = () : void => {
    if (this.settings.particles.shape.type == 'image') {
      if (this.settings.tmp.img_type == 'svg' &&
          this.settings.tmp.source_svg == null) {
        this.settings.tmp.checkAnimFrame = window.requestAnimationFrame(this.settings.tmp.checkAnimFrame);
      } else {
        window.cancelAnimationFrame(this.settings.tmp.checkAnimFrame);
        if (!this.settings.tmp.img_error) {
          this.init();
          this.draw();
        }
      }
    } else {
      this.init();
      this.draw();
    }
  }

  private init = () : void => {
    this.settings.particles.line_linked.color_rgb_line = hexToRgb(this.settings.particles.line_linked.color);

    this.settings.tmp.obj = {
      'size_value': this.settings.particles.size.value,
      'size_anim_speed': this.settings.particles.size.anim.speed,
      'move_speed': this.settings.particles.move.speed,
      'line_linked_distance': this.settings.particles.line_linked.distance,
      'line_linked_width': this.settings.particles.line_linked.width,
      'mode_grab_distance': this.settings.interactivity.modes.grab.distance,
      'mode_bubble_distance': this.settings.interactivity.modes.bubble.distance,
      'mode_bubble_size': this.settings.interactivity.modes.bubble.size,
      'mode_repulse_distance': this.settings.interactivity.modes.repulse.distance
    };

    this.retinaInit();
    this.canvasSize();
    this.canvasPaint();
    this.particlesCreate();
    this.densityAutoParticles();
  }

  private begin = () : void => {
    if (isInArray('image', this.settings.particles.shape.type)) {
      this.settings.tmp.img_type = this.settings.particles.shape.image.src.substring(this.settings.particles.shape.image.src.length - 3);
      this.loadImg(this.settings.tmp.img_type);
    } else {
      this.checkBeforeDraw();
    }
  }
}