exports.__esModule = true;
// import { Conf } from './utils/interfaces';
var utils_1 = require("./utils/utils");
var Particle = /** @class */ (function () {
    function Particle(opacity, particles, color, position) {
        if (position === void 0) { position = null; }
        var _this = this;
        this.opacity = opacity;
        this.particles = particles;
        this.position = position;
        // public particles : Particles;
        this.color = { value: null, rgb: null, hsl: null };
        this.checkOverlap = function (position) {
            if (position === void 0) { position = null; }
            for (var i = 0; i < _this.particles.settings.particles.array.length; i++) {
                var p2 = _this.particles.settings.particles.array[i];
                var dx = _this.x - p2.x, dy = _this.y - p2.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= _this.radius + p2.radius) {
                    _this.x = position != null
                        ? position.x
                        : utils_1.randomFloat() * _this.particles.canvasWidth;
                    _this.y = position != null
                        ? position.y
                        : utils_1.randomFloat() * _this.particles.canvasHeight;
                    _this.checkOverlap();
                }
            }
        };
        this.drawPolygon = function (c, startX, startY, sideLength, sideCountNumerator, sideCountDenominator) {
            var sideCount = sideCountNumerator * sideCountDenominator;
            var decimalSides = sideCountNumerator / sideCountDenominator;
            var interiorAngleDegrees = (180 * (decimalSides - 2)) / decimalSides;
            var interiorAngle = Math.PI - Math.PI * interiorAngleDegrees / 180; // convert to radians
            c.save();
            c.beginPath();
            c.translate(startX, startY);
            c.moveTo(0, 0);
            for (var i = 0; i < sideCount; i++) {
                c.lineTo(sideLength, 0);
                c.translate(sideLength, 0);
                c.rotate(interiorAngle);
            }
            //c.stroke();
            c.restore();
        };
        this.drawShape = function (shape, radius, stroke) {
            // console.log(shape);
            if (stroke === void 0) { stroke = false; }
            switch (shape) {
                case 'circle':
                    _this.particles.ctx.arc(_this.x, _this.y, radius, 0, Math.PI * 2, false);
                    break;
                case 'edge':
                case 'square':
                    _this.particles.ctx.rect(_this.x - radius, _this.y - radius, radius * 2, radius * 2);
                    break;
                case 'triangle':
                    _this.drawPolygon(_this.particles.ctx, _this.x - radius, _this.y + radius / 1.66, radius * 2, 3, 2);
                    break;
                case 'polygon':
                    _this.drawPolygon(_this.particles.ctx, _this.x - radius /
                        (_this.particles.settings.particles.shape.polygon.nb_sides / 3.5), // startX
                    _this.y - radius / (2.66 / 3.5), // startY
                    radius * 2.66 /
                        (_this.particles.settings.particles.shape.polygon.nb_sides / 3), // sideLength
                    _this.particles.settings.particles.shape.polygon.nb_sides, // sideCountNumerator
                    1 // sideCountDenominator
                    );
                    break;
                case 'star':
                    _this.drawPolygon(_this.particles.ctx, _this.x - radius * 2 /
                        (_this.particles.settings.particles.shape.polygon.nb_sides / 4), // startX
                    _this.y - radius / (2 * 2.66 / 3.5), // startY
                    radius * 2 * 2.66 /
                        (_this.particles.settings.particles.shape.polygon.nb_sides / 3), // sideLength
                    _this.particles.settings.particles.shape.polygon.nb_sides, // sideCountNumerator
                    2 // sideCountDenominator
                    );
                    break;
                case 'heart':
                    var x = _this.x - radius / 2;
                    var y = _this.y - radius / 2;
                    _this.particles.ctx.moveTo(x, y + radius / 4);
                    _this.particles.ctx.quadraticCurveTo(x, y, x + radius / 4, y);
                    _this.particles.ctx.quadraticCurveTo(x + radius / 2, y, x + radius / 2, y + radius / 4);
                    _this.particles.ctx.quadraticCurveTo(x + radius / 2, y, x + radius * 3 / 4, y);
                    _this.particles.ctx.quadraticCurveTo(x + radius, y, x + radius, y + radius / 4);
                    _this.particles.ctx.quadraticCurveTo(x + radius, y + radius / 2, x + radius * 3 / 4, y + radius * 3 / 4);
                    _this.particles.ctx.lineTo(x + radius / 2, y + radius);
                    _this.particles.ctx.lineTo(x + radius / 4, y + radius * 3 / 4);
                    _this.particles.ctx.quadraticCurveTo(x, y + radius / 2, x, y + radius / 4);
                    break;
                case 'char':
                case 'character':
                    _this.particles.ctx.font = _this.particles.settings.particles.shape.character.style + " " + _this.particles.settings.particles.shape.character.weight + " " + Math.round(radius) * 2 + "px " + _this.particles.settings.particles.shape.character.font;
                    if (stroke) {
                        _this.particles.ctx.strokeText(_this.character, _this.x - radius / 2, _this.y + radius / 2);
                    }
                    else {
                        _this.particles.ctx.fillText(_this.character, _this.x - radius / 2, _this.y + radius / 2);
                    }
                    break;
                case 'image':
                    var draw = function (img_obj) {
                        _this.particles.ctx.drawImage(img_obj, _this.x - radius, _this.y - radius, radius * 2, radius * 2 / _this.img.ratio);
                    };
                    var img_obj;
                    if (_this.particles.settings.tmp.img_type == 'svg') {
                        img_obj = _this.img.obj;
                    }
                    else {
                        img_obj = _this.particles.settings.tmp.img_obj;
                    }
                    if (img_obj != null) {
                        draw(img_obj);
                    }
                    break;
            }
        };
        this.createSvgImg = function () {
            /* set color to svg element */
            var svgXml = _this.particles.settings.tmp.source_svg;
            var coloredSvgXml = svgXml.replace(/#([0-9A-F]{3,6})/gi, function (m) {
                var color_value;
                if (_this.color.rgb) {
                    color_value = "rgba(" + _this.color.rgb.r + "," + _this.color.rgb.g + "," + _this.color.rgb.b + "," + _this.opacity + ")";
                }
                else {
                    color_value = "hsla(" + _this.color.hsl.h + "," + _this.color.hsl.s + "%," + _this.color.hsl.l + "%," + _this.opacity + ")";
                }
                return color_value;
            });
            /* prepare to create img with colored svg */
            var svg = new Blob([coloredSvgXml], { type: 'image/svg+xml;charset=utf-8' });
            var url = URL.createObjectURL(svg);
            /* create particle img obj */
            var img = new Image();
            img.addEventListener('load', function (e) {
                _this.img.obj = img;
                _this.img.loaded = true;
                URL.revokeObjectURL(url);
                _this.particles.settings.tmp.count_svg++;
            });
            img.src = url;
        };
        this.draw = function () {
            var radius, opacity;
            var colorValue;
            if (_this.radius_bubble != null) {
                radius = _this.radius_bubble;
            }
            else {
                radius = _this.radius;
            }
            if (_this.opacity_bubble != null) {
                opacity = _this.opacity_bubble;
            }
            else {
                opacity = _this.opacity;
            }
            if (_this.color.rgb != null) {
                colorValue = "rgba(" + _this.color.rgb.r + "," + _this.color.rgb.g + "," + _this.color.rgb.b + "," + opacity + ")";
            }
            else {
                colorValue = "hsla(" + _this.color.hsl.h + "," + _this.color.hsl.s + "%," + _this.color.hsl.l + "%," + opacity + ")";
            }
            _this.particles.ctx.fillStyle = colorValue;
            _this.particles.ctx.beginPath();
            _this.drawShape(_this.shape, radius);
            _this.particles.ctx.closePath();
            if (_this.particles.settings.particles.shape.stroke.width > 0) {
                _this.particles.ctx.strokeStyle = _this.particles.settings.particles.shape.stroke.color;
                _this.particles.ctx.lineWidth = _this.particles.settings.particles.shape.stroke.width;
                _this.particles.ctx.stroke();
            }
            _this.particles.ctx.fill();
        };
        this.radius = (this.particles.settings.particles.size.random
            ? utils_1.randomFloat()
            : 1) * this.particles.settings.particles.size.value;
        if (this.particles.settings.particles.size.anim.enable) {
            this.sizeStatus = false;
            this.vs = this.particles.settings.particles.size.anim.speed / 100;
            if (!this.particles.settings.particles.size.anim.sync) {
                this.vs = this.vs * utils_1.randomFloat();
            }
        }
        this.x = this.position != null
            ? this.position.x
            : utils_1.randomFloat() * this.particles.canvasWidth;
        this.y = this.position != null
            ? this.position.y
            : utils_1.randomFloat() * this.particles.canvasHeight;
        if (this.x > this.particles.canvasWidth - this.radius * 2)
            this.x = this.x - this.radius;
        else if (this.x < this.radius * 2)
            this.x = this.x + this.radius;
        if (this.y > this.particles.canvasHeight - this.radius * 2)
            this.y = this.y - this.radius;
        else if (this.y < this.radius * 2)
            this.y = this.y + this.radius;
        /* check position - avoid overlap */
        if (this.particles.settings.particles.move.bounce) {
            this.checkOverlap(this.position);
        }
        if (Array.isArray(color)) {
            var color_selected = color[Math.floor(utils_1.randomFloat() * this.particles.settings.particles.color.value.length)];
            this.color.rgb = utils_1.hexToRgb(color_selected);
        }
        else if (color == 'random') {
            this.color.rgb = {
                'r': Math.floor((utils_1.randomFloat() * (255 - 0 + 1)) + 0),
                'g': Math.floor((utils_1.randomFloat() * (255 - 0 + 1)) + 0),
                'b': Math.floor((utils_1.randomFloat() * (255 - 0 + 1)) + 0)
            };
        }
        else {
            this.color.value = color;
            this.color.rgb = utils_1.hexToRgb(color);
        }
        this.opacity = (this.particles.settings.particles.opacity.random
            ? utils_1.randomFloat()
            : 1) *
            this.particles.settings.particles.opacity.value;
        if (this.particles.settings.particles.opacity.anim.enable) {
            this.opacityStatus = false;
            this.vo = this.particles.settings.particles.opacity.anim.speed / 100;
            if (!this.particles.settings.particles.opacity.anim.sync) {
                this.vo = this.vo * utils_1.randomFloat();
            }
        }
        var velbase;
        switch (this.particles.settings.particles.move.direction) {
            case 'top':
                velbase = { 'x': 0, 'y': -1 };
                break;
            case 'top-right':
                velbase = { 'x': 0.5, 'y': -0.5 };
                break;
            case 'right':
                velbase = { 'x': 1, 'y': -0 };
                break;
            case 'bottom-right':
                velbase = { 'x': 0.5, 'y': 0.5 };
                break;
            case 'bottom':
                velbase = { 'x': 0, 'y': 1 };
                break;
            case 'bottom-left':
                velbase = { 'x': -0.5, 'y': 1 };
                break;
            case 'left':
                velbase = { 'x': -1, 'y': 0 };
                break;
            case 'top-left':
                velbase = { 'x': -0.5, 'y': -0.5 };
                break;
            default:
                velbase = { 'x': 0, 'y': 0 };
                break;
        }
        if (this.particles.settings.particles.move.straight) {
            this.vx = velbase.x;
            this.vy = velbase.y;
            if (this.particles.settings.particles.move.parallax) {
                this.vx = velbase.x * this.radius;
                this.vy = velbase.y * this.radius;
            }
            else if (this.particles.settings.particles.move.random) {
                this.vx = this.vx * (utils_1.randomFloat());
                this.vy = this.vy * (utils_1.randomFloat());
            }
        }
        else {
            if (this.particles.settings.particles.move.parallax) {
                this.vx = (velbase.x + utils_1.randomInt(2) - 0.5) * this.radius;
                this.vy = (velbase.y + utils_1.randomInt(2) - 0.5) * this.radius;
            }
            else {
                this.vx = velbase.x + utils_1.randomFloat() - 0.5;
                this.vy = velbase.y + utils_1.randomFloat() - 0.5;
            }
        }
        // var theta = 2.0 * Math.PI * randomFloat();
        // this.vx = Math.cos(theta);
        // this.vy = Math.sin(theta);
        this.vxI = this.vx;
        this.vyI = this.vy;
        var shape_type = this.particles.settings.particles.shape.type;
        if (typeof shape_type === 'string') {
            this.shape = shape_type.toString();
        }
        else {
            if (Array.isArray(shape_type)) {
                this.shape = shape_type[Math.floor(utils_1.randomFloat() * shape_type.length)];
            }
        }
        if (this.shape == 'image') {
            var sh = this.particles.settings.particles.shape;
            this.img = {
                src: sh.image.src,
                ratio: sh.image.width / sh.image.height,
                loaded: null,
                obj: null
            };
            if (this.img.ratio == 0)
                this.img.ratio = 1;
            if (this.particles.settings.particles.tmp.img_type == 'svg' &&
                this.particles.settings.particles.tmp.source_svg != null) {
                this.createSvgImg();
                if (this.particles.settings.particles.tmp.pushing) {
                    this.img.loaded = false;
                }
            }
        }
        else if (this.shape == 'char' || this.shape == 'character') {
            if (typeof this.particles.settings.particles.shape.character.value === 'string') {
                this.character = this.particles.settings.particles.shape.character.value;
            }
            else {
                if (Array.isArray(this.particles.settings.particles.shape.character.value)) {
                    this.character = this.particles.settings.particles.shape.character.value[Math.floor(utils_1.randomFloat() *
                        this.particles.settings.particles.shape.character.value.length)];
                }
            }
        }
    }
    return Particle;
}());
exports.Particle = Particle;
