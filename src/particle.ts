// import { Conf } from './utils/interfaces';
import { randomInt, randomFloat, hexToRgb } from './utils/utils';
import { Shape, XY, RGB, HSL } from './utils/interfaces';
import { Particles } from './particles';

export class Particle {
  // public particles : Particles;

  public color : {value : string, rgb: RGB, hsl: HSL} = {value : null, rgb: null, hsl: null};

  // public opacity : number;
  public opacity_bubble : number;

  public radius : number;
  public radius_bubble : number;

  public x : number;
  public y : number;

  public sizeStatus : boolean;
  public opacityStatus : boolean;

  public shape : string;

  public img : {
    src : string | string[],
    ratio : number,
    loaded : boolean,
    obj : HTMLImageElement
  };
  public character : any;

  public vs : number;
  public vx : number;
  public vy : number;
  public vxI : number;
  public vyI : number;
  public vo : number;

  constructor(
    public opacity : number,
    public particles : Particles,
    color : string | string[],
    public position : XY = null
  ) {
    this.radius = (this.particles.settings.particles.size.random
            ? randomFloat()
            : 1) * this.particles.settings.particles.size.value;
    if (this.particles.settings.particles.size.anim.enable) {
      this.sizeStatus = false;
      this.vs = this.particles.settings.particles.size.anim.speed / 100;
      if (!this.particles.settings.particles.size.anim.sync) {
        this.vs = this.vs * randomFloat();
      }
    }

    this.x = this.position != null
        ? this.position.x
        : randomFloat() * this.particles.canvasWidth;
    this.y = this.position != null
        ? this.position.y
        : randomFloat() * this.particles.canvasHeight;

    if (this.x > this.particles.canvasWidth - this.radius * 2)
      this.x = this.x - this.radius;
    else if (this.x < this.radius * 2) this.x = this.x + this.radius;
    if (this.y > this.particles.canvasHeight - this.radius * 2)
      this.y = this.y - this.radius;
    else if (this.y < this.radius * 2) this.y = this.y + this.radius;

    /* check position - avoid overlap */
    if (this.particles.settings.particles.move.bounce) {
      this.checkOverlap(this.position);
    }

    if (Array.isArray(color)) {
      let color_selected : string = color[Math.floor(randomFloat() * this.particles.settings.particles.color.value.length)];
      this.color.rgb = hexToRgb(color_selected);
    } else if (color == 'random') {
      this.color.rgb = {
        'r': Math.floor((randomFloat() * (255 - 0 + 1)) + 0),
        'g': Math.floor((randomFloat() * (255 - 0 + 1)) + 0),
        'b': Math.floor((randomFloat() * (255 - 0 + 1)) + 0)
      };
    } else {
      this.color.value = color;
      this.color.rgb = hexToRgb(color);
    }

    this.opacity = (this.particles.settings.particles.opacity.random
            ? randomFloat()
            : 1) *
        this.particles.settings.particles.opacity.value;
    if (this.particles.settings.particles.opacity.anim.enable) {
      this.opacityStatus = false;
      this.vo = this.particles.settings.particles.opacity.anim.speed / 100;
      if (!this.particles.settings.particles.opacity.anim.sync) {
        this.vo = this.vo * randomFloat();
      }
    }

    let velbase : XY;
    switch (this.particles.settings.particles.move.direction) {
      case 'top':
        velbase = {'x': 0, 'y': -1};
        break;
      case 'top-right':
        velbase = {'x': 0.5, 'y': -0.5};
        break;
      case 'right':
        velbase = {'x': 1, 'y': -0};
        break;
      case 'bottom-right':
        velbase = {'x': 0.5, 'y': 0.5};
        break;
      case 'bottom':
        velbase = {'x': 0, 'y': 1};
        break;
      case 'bottom-left':
        velbase = {'x': -0.5, 'y': 1};
        break;
      case 'left':
        velbase = {'x': -1, 'y': 0};
        break;
      case 'top-left':
        velbase = {'x': -0.5, 'y': -0.5};
        break;
      default:
        velbase = {'x': 0, 'y': 0};
        break;
    }

    if (this.particles.settings.particles.move.straight) {
      this.vx = velbase.x;
      this.vy = velbase.y;

      if (this.particles.settings.particles.move.parallax) {
        this.vx = velbase.x * this.radius;
        this.vy = velbase.y * this.radius;
      } else if (this.particles.settings.particles.move.random) {
        this.vx = this.vx * (randomFloat());
        this.vy = this.vy * (randomFloat());
      }
    } else {
      if (this.particles.settings.particles.move.parallax) {
        this.vx = (velbase.x + randomInt(2) - 0.5) * this.radius;
        this.vy = (velbase.y + randomInt(2) - 0.5) * this.radius;
      } else {
        this.vx = velbase.x + randomFloat() - 0.5;
        this.vy = velbase.y + randomFloat() - 0.5;
      }
    }

    // var theta = 2.0 * Math.PI * randomFloat();
    // this.vx = Math.cos(theta);
    // this.vy = Math.sin(theta);

    this.vxI = this.vx;
    this.vyI = this.vy;

    let shape_type = this.particles.settings.particles.shape.type;
    
    if (typeof shape_type === 'string') {
      this.shape = shape_type.toString();
    } else {
      if (Array.isArray(shape_type)) {
        this.shape = shape_type[Math.floor(randomFloat() * shape_type.length)];
      }
    }

    if (this.shape == 'image') {
      let sh : Shape = this.particles.settings.particles.shape;
      this.img = {
        src: sh.image.src,
        ratio: sh.image.width / sh.image.height,
        loaded: null,
        obj: null
      };
      if (this.img.ratio == 0) this.img.ratio = 1;

      if (this.particles.settings.particles.tmp.img_type == 'svg' &&
          this.particles.settings.particles.tmp.source_svg != null) {
        this.createSvgImg();
        if (this.particles.settings.particles.tmp.pushing) {
          this.img.loaded = false;
        }
      }
    } else if (this.shape == 'char' || this.shape == 'character') {
      if (typeof this.particles.settings.particles.shape.character.value === 'string') {
        this.character = this.particles.settings.particles.shape.character.value;
      } else {
        if (Array.isArray(this.particles.settings.particles.shape.character.value)) {
          this.character = this.particles.settings.particles.shape.character.value[Math.floor(randomFloat() *
                  this.particles.settings.particles.shape.character.value.length)];
        }
      }
    }
  }

  private checkOverlap = (position : XY = null) : void => {
    for (let i = 0; i < this.particles.settings.particles.array.length; i++) {
      let p2 : Particle = this.particles.settings.particles.array[i];

      let dx : number = this.x - p2.x, dy = this.y - p2.y;

      let dist : number = Math.sqrt(dx * dx + dy * dy);

      if (dist <= this.radius + p2.radius) {
        this.x = position != null
            ? position.x
            : randomFloat() * this.particles.canvasWidth;
        this.y = position != null
            ? position.y
            : randomFloat() * this.particles.canvasHeight;
        this.checkOverlap();
      }
    }
  }

  private drawPolygon = (c : CanvasRenderingContext2D, startX : number, startY : number, sideLength : number, sideCountNumerator : number, sideCountDenominator : number) : void => {
    let sideCount : number = sideCountNumerator * sideCountDenominator;
    let decimalSides : number = sideCountNumerator / sideCountDenominator;
    let interiorAngleDegrees : number = (180 * (decimalSides - 2)) / decimalSides;
    let interiorAngle : number = Math.PI - Math.PI * interiorAngleDegrees / 180; // convert to radians
    c.save();
    c.beginPath();
    c.translate(startX, startY);
    c.moveTo(0, 0);
    for (let i = 0; i < sideCount; i++) {
      c.lineTo(sideLength, 0);
      c.translate(sideLength, 0);
      c.rotate(interiorAngle);
    }
    //c.stroke();
    c.restore();
  }

  public drawShape = (shape : string, radius : number, stroke : boolean = false) => {
    // console.log(shape);
    
    switch (shape) {
      case 'circle':
        this.particles.ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, false);
        break;

      case 'edge':
      case 'square':
        this.particles.ctx.rect(this.x - radius, this.y - radius, radius * 2, radius * 2);
        break;

      case 'triangle':
        this.drawPolygon(this.particles.ctx, this.x - radius, this.y + radius / 1.66, radius * 2, 3, 2);
        break;

      case 'polygon':
        this.drawPolygon(
          this.particles.ctx,
          this.x - radius /
                  (this.particles.settings.particles.shape.polygon.nb_sides / 3.5), // startX
          this.y - radius / (2.66 / 3.5), // startY
          radius * 2.66 /
              (this.particles.settings.particles.shape.polygon.nb_sides / 3), // sideLength
          this.particles.settings.particles.shape.polygon.nb_sides, // sideCountNumerator
          1 // sideCountDenominator
        );
        break;

      case 'star':
        this.drawPolygon(
          this.particles.ctx,
          this.x - radius * 2 /
                  (this.particles.settings.particles.shape.polygon.nb_sides / 4), // startX
          this.y - radius / (2 * 2.66 / 3.5), // startY
          radius * 2 * 2.66 /
              (this.particles.settings.particles.shape.polygon.nb_sides / 3), // sideLength
          this.particles.settings.particles.shape.polygon.nb_sides, // sideCountNumerator
          2 // sideCountDenominator
        );
        break;

      case 'heart':
        var x = this.x - radius / 2;
        var y = this.y - radius / 2;

        this.particles.ctx.moveTo(x, y + radius / 4);
        this.particles.ctx.quadraticCurveTo(x, y, x + radius / 4, y);
        this.particles.ctx.quadraticCurveTo(x + radius / 2, y, x + radius / 2, y + radius / 4);
        this.particles.ctx.quadraticCurveTo(x + radius / 2, y, x + radius * 3 / 4, y);
        this.particles.ctx.quadraticCurveTo(x + radius, y, x + radius, y + radius / 4);
        this.particles.ctx.quadraticCurveTo(x + radius, y + radius / 2, x + radius * 3 / 4, y + radius * 3 / 4);
        this.particles.ctx.lineTo(x + radius / 2, y + radius);
        this.particles.ctx.lineTo(x + radius / 4, y + radius * 3 / 4);
        this.particles.ctx.quadraticCurveTo(x, y + radius / 2, x, y + radius / 4);
        break;

      case 'char':
      case 'character':
        this.particles.ctx.font = `${this.particles.settings.particles.shape.character.style} ${this.particles.settings.particles.shape.character.weight} ${Math.round(radius) * 2}px ${this.particles.settings.particles.shape.character.font}`;
        if (stroke) {
        this.particles.ctx.strokeText(this.character, this.x - radius/2, this.y + radius/2);
        } else {
        this.particles.ctx.fillText(this.character, this.x - radius/2, this.y + radius/2);
        }
        break;

      case 'image':
        let draw = (img_obj) => {
          this.particles.ctx.drawImage(img_obj, this.x - radius,
              this.y - radius, radius * 2, radius * 2 / this.img.ratio);
        }

        var img_obj;

        if (this.particles.settings.tmp.img_type == 'svg') {
          img_obj = this.img.obj;
        } else {
          img_obj = this.particles.settings.tmp.img_obj;
        }

        if (img_obj != null) {
          draw(img_obj);
        }

        break;
    }
  }

  private createSvgImg = () : void => {
    /* set color to svg element */
    let svgXml : string = this.particles.settings.tmp.source_svg;
    let coloredSvgXml : string = svgXml.replace(/#([0-9A-F]{3,6})/gi, (m) => {
      let color_value : string;
      if (this.color.rgb) {
        color_value = `rgba(${this.color.rgb.r},${this.color.rgb.g},${this.color.rgb.b},${this.opacity})`;
      } else {
        color_value = `hsla(${this.color.hsl.h},${this.color.hsl.s}%,${this.color.hsl.l}%,${this.opacity})`;
      }
      return color_value;
    });

    /* prepare to create img with colored svg */
    let svg : Blob = new Blob([coloredSvgXml], {type : 'image/svg+xml;charset=utf-8'});
    let url : string = URL.createObjectURL(svg);

    /* create particle img obj */
    let img : HTMLImageElement = new Image();
    img.addEventListener('load', (e) => {
      this.img.obj = img;
      this.img.loaded = true;
      URL.revokeObjectURL(url);
      this.particles.settings.tmp.count_svg++;
    });
    img.src = url;
  }

  public draw = () : void => {
    let radius : number, opacity;

    let colorValue : string;

    if (this.radius_bubble != null) {
      radius = this.radius_bubble;
    } else {
      radius = this.radius;
    }

    if (this.opacity_bubble != null) {
      opacity = this.opacity_bubble;
    } else {
      opacity = this.opacity;
    }

    if (this.color.rgb != null) {
      colorValue = `rgba(${this.color.rgb.r},${this.color.rgb.g},${this.color.rgb.b},${opacity})`;
    } else {
      colorValue = `hsla(${this.color.hsl.h},${this.color.hsl.s}%,${this.color.hsl.l}%,${opacity})`;
    }

    this.particles.ctx.fillStyle = colorValue;
    this.particles.ctx.beginPath();

    this.drawShape(this.shape, radius);

    this.particles.ctx.closePath();

    if (this.particles.settings.particles.shape.stroke.width > 0) {
      this.particles.ctx.strokeStyle = this.particles.settings.particles.shape.stroke.color;
      this.particles.ctx.lineWidth = this.particles.settings.particles.shape.stroke.width;
      this.particles.ctx.stroke();
    }

    this.particles.ctx.fill();
  }
}