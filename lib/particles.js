exports.__esModule = true;
var utils_1 = require("./utils/utils");
var defaults_1 = require("./utils/defaults");
var particle_1 = require("./particle");
var Particles = /** @class */ (function () {
    function Particles(id, config) {
        var _this = this;
        if (id === void 0) { id = 'particles'; }
        if (config === void 0) { config = null; }
        this.id = id;
        this.config = config;
        this.settings = defaults_1.defaultConf;
        this.start = function () {
            _this.createCanvas();
            if (_this.config) {
                _this.settings = utils_1.deepExtend(_this.settings, _this.config);
            }
            _this.eventsListeners();
            _this.begin();
            return _this;
        };
        this.retinaInit = function () {
            if (_this.settings.retina_detect && window.devicePixelRatio > 1) {
                _this.pxratio = window.devicePixelRatio;
                _this.settings.tmp.retina = true;
            }
            else {
                _this.pxratio = 1;
                _this.settings.tmp.retina = false;
            }
            _this.canvasWidth = _this.canvas.offsetWidth * _this.pxratio;
            _this.canvasHeight = _this.canvas.offsetHeight * _this.pxratio;
            _this.settings.particles.size.value = _this.settings.tmp.obj.size_value * _this.pxratio;
            _this.settings.particles.size.anim.speed = _this.settings.tmp.obj.size_anim_speed * _this.pxratio;
            _this.settings.particles.move.speed = _this.settings.tmp.obj.move_speed * _this.pxratio;
            _this.settings.particles.line_linked.distance = _this.settings.tmp.obj.line_linked_distance * _this.pxratio;
            _this.settings.interactivity.modes.grab.distance = _this.settings.tmp.obj.mode_grab_distance * _this.pxratio;
            _this.settings.interactivity.modes.bubble.distance = _this.settings.tmp.obj.mode_bubble_distance * _this.pxratio;
            _this.settings.particles.line_linked.width = _this.settings.tmp.obj.line_linked_width * _this.pxratio;
            _this.settings.interactivity.modes.bubble.size = _this.settings.tmp.obj.mode_bubble_size * _this.pxratio;
            _this.settings.interactivity.modes.repulse.distance = _this.settings.tmp.obj.mode_repulse_distance * _this.pxratio;
        };
        /* ---------- Particles functions - canvas ------------ */
        this.createCanvas = function () {
            if (_this.id == null) {
                _this.id = 'particles';
            }
            var tag = document.getElementById(_this.id);
            var canvasClass = 'particles-ts-canvas-el';
            var existCanvas = tag.getElementsByClassName(canvasClass);
            if (existCanvas.length > 0) {
                while (existCanvas.length > 0) {
                    existCanvas[0].remove();
                }
            }
            var canvasEl = document.createElement('canvas');
            canvasEl.className = canvasClass;
            canvasEl.style.width = "100%";
            canvasEl.style.height = "100%";
            _this.canvas = tag.appendChild(canvasEl);
            _this.canvas = document.querySelector("#" + _this.id + " > .particles-ts-canvas-el");
            _this.ctx = _this.canvas.getContext('2d');
        };
        this.canvasSize = function () {
            _this.canvas.width = _this.canvasWidth;
            _this.canvas.height = _this.canvasHeight;
            if (_this.settings != null && _this.settings.interactivity.events.resize) {
                window.addEventListener('resize', function (_) {
                    _this.canvasWidth = _this.canvas.offsetWidth;
                    _this.canvasHeight = _this.canvas.offsetHeight;
                    if ('retina' in _this.settings.tmp && _this.settings.tmp.retina) {
                        _this.canvasWidth *= _this.pxratio;
                        _this.canvasHeight *= _this.pxratio;
                    }
                    _this.canvas.width = _this.canvasWidth;
                    _this.canvas.height = _this.canvasHeight;
                    if (!_this.settings.particles.move.enable) {
                        _this.particlesEmpty();
                        _this.particlesCreate();
                        _this.particlesDraw();
                        _this.densityAutoParticles();
                    }
                    _this.densityAutoParticles();
                });
            }
        };
        this.canvasPaint = function () {
            _this.ctx.fillRect(0, 0, _this.canvasWidth, _this.canvasHeight);
        };
        this.canvasClear = function () {
            _this.ctx.clearRect(0, 0, _this.canvasWidth, _this.canvasHeight);
        };
        this.particlesCreate = function () {
            for (var i = 0; i < _this.settings.particles.number.value; i++) {
                _this.settings.particles.array.push(new particle_1.Particle(_this.settings.particles.opacity.value, _this, _this.settings.particles.color.value));
            }
            _this.settings.particles.array.sort(function (a, b) { return a.radius > b.radius ? 1 : -1; });
        };
        this.particlesUpdate = function () {
            for (var i = 0; i < _this.settings.particles.array.length; i++) {
                var p = _this.settings.particles.array[i];
                if (_this.settings.particles.move.enable) {
                    var ms = _this.settings.particles.move.speed / 2;
                    p.x += p.vx * ms;
                    p.y += p.vy * ms;
                }
                if (_this.settings.particles.opacity.anim.enable) {
                    if (p.opacityStatus == true) {
                        if (p.opacity >= _this.settings.particles.opacity.value) {
                            p.opacityStatus = false;
                        }
                        p.opacity += p.vo;
                    }
                    else {
                        if (p.opacity <= _this.settings.particles.opacity.anim.opacity_min) {
                            p.opacityStatus = true;
                        }
                        p.opacity -= p.vo;
                    }
                    if (p.opacity < 0)
                        p.opacity = 0;
                }
                if (_this.settings.particles.size.anim.enable) {
                    if (p.sizeStatus == true) {
                        if (p.radius >= _this.settings.particles.size.value) {
                            p.sizeStatus = false;
                        }
                        p.radius += p.vs;
                    }
                    else {
                        if (p.radius <= _this.settings.particles.size.anim.size_min) {
                            p.sizeStatus = true;
                        }
                        p.radius -= p.vs;
                    }
                    if (p.radius < 0)
                        p.radius = 0;
                }
                var new_pos = void 0;
                if (_this.settings.particles.move.out_mode == 'bounce') {
                    new_pos = {
                        x_left: p.radius,
                        x_right: _this.canvasWidth,
                        y_top: p.radius,
                        y_bottom: _this.canvasHeight
                    };
                }
                else {
                    new_pos = {
                        x_left: -p.radius,
                        x_right: _this.canvasWidth + p.radius,
                        y_top: -p.radius,
                        y_bottom: _this.canvasHeight + p.radius
                    };
                }
                if (p.x - p.radius > _this.canvasWidth) {
                    p.x = new_pos.x_left;
                    p.y = utils_1.randomFloat() * _this.canvasHeight;
                }
                else if (p.x + p.radius < 0) {
                    p.x = new_pos.x_right;
                    p.y = utils_1.randomFloat() * _this.canvasHeight;
                }
                if (p.y - p.radius > _this.canvasHeight) {
                    p.y = new_pos.y_top;
                    p.x = utils_1.randomFloat() * _this.canvasWidth;
                }
                else if (p.y + p.radius < 0) {
                    p.y = new_pos.y_bottom;
                    p.x = utils_1.randomFloat() * _this.canvasWidth;
                }
                /* out of canvas modes */
                switch (_this.settings.particles.move.out_mode) {
                    case 'bounce':
                        if (p.x + p.radius > _this.canvasWidth) {
                            p.vx = -p.vx;
                        }
                        else if (p.x - p.radius < 0) {
                            p.vx = -p.vx;
                        }
                        if (p.y + p.radius > _this.canvasHeight) {
                            p.vy = -p.vy;
                        }
                        else if (p.y - p.radius < 0) {
                            p.vy = -p.vy;
                        }
                        break;
                }
                if (utils_1.isInArray('grab', _this.settings.interactivity.events.onhover.mode)) {
                    _this.grabParticle(p);
                }
                if (utils_1.isInArray('bubble', _this.settings.interactivity.events.onhover.mode) || utils_1.isInArray('bubble', _this.settings.interactivity.events.onclick.mode)) {
                    _this.bubbleParticle(p);
                }
                if (utils_1.isInArray('repulse', _this.settings.interactivity.events.onhover.mode) || utils_1.isInArray('repulse', _this.settings.interactivity.events.onclick.mode)) {
                    _this.repulseParticle(p);
                }
                if (_this.settings.particles.line_linked.enable ||
                    _this.settings.particles.move.attract.enable ||
                    _this.settings.particles.move.bounce) {
                    for (var j = i + 1; j < _this.settings.particles.array.length; j++) {
                        var p2 = _this.settings.particles.array[j];
                        if (_this.settings.particles.line_linked.enable) {
                            _this.linkParticles(p, p2);
                        }
                        if (_this.settings.particles.move.attract.enable) {
                            _this.attractParticles(p, p2);
                        }
                        if (_this.settings.particles.move.bounce) {
                            _this.bounceParticles(p, p2);
                        }
                    }
                }
            }
        };
        this.particlesDraw = function () {
            _this.ctx.clearRect(0, 0, _this.canvasWidth, _this.canvasHeight);
            _this.particlesUpdate();
            for (var i = 0; i < _this.settings.particles.array.length; i++) {
                var p = _this.settings.particles.array[i];
                p.draw();
            }
        };
        this.particlesEmpty = function () {
            _this.settings.particles.array = [];
        };
        this.particlesRefresh = function (config) {
            if (config === void 0) { config = null; }
            window.cancelAnimationFrame(_this.settings.tmp.checkAnimFrame);
            window.cancelAnimationFrame(_this.drawAnimFrame);
            _this.settings.tmp.source_svg = null;
            _this.settings.tmp.img_obj = null;
            _this.settings.tmp.count_svg = 0;
            _this.particlesEmpty();
            _this.canvasClear();
            if (config) {
                _this.settings = utils_1.deepExtend(_this.settings, config);
            }
            /* restart */
            _this.begin();
        };
        this.linkParticles = function (p1, p2) {
            var dx = p1.x - p2.x, dy = p1.y - p2.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= _this.settings.particles.line_linked.distance) {
                var opacity_line = _this.settings.particles.line_linked.opacity -
                    (dist / (1 / _this.settings.particles.line_linked.opacity)) /
                        _this.settings.particles.line_linked.distance;
                if (opacity_line > 0) {
                    var color_line = _this.settings.particles.line_linked.color_rgb_line;
                    _this.ctx.strokeStyle = "rgba(" + color_line.r + "," + color_line.g + "," + color_line.b + "," + opacity_line + ")";
                    _this.ctx.lineWidth = _this.settings.particles.line_linked.width;
                    /* path */
                    _this.ctx.beginPath();
                    _this.ctx.moveTo(p1.x, p1.y);
                    _this.ctx.lineTo(p2.x, p2.y);
                    _this.ctx.stroke();
                    _this.ctx.closePath();
                }
            }
        };
        this.attractParticles = function (p1, p2) {
            var dx = p1.x - p2.x, dy = p1.y - p2.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= _this.settings.particles.line_linked.distance) {
                var ax = dx / (_this.settings.particles.move.attract.rotateX * 1000), ay = dy / (_this.settings.particles.move.attract.rotateY * 1000);
                p1.vx -= ax;
                p1.vy -= ay;
                p2.vx += ax;
                p2.vy += ay;
            }
        };
        this.bounceParticles = function (p1, p2) {
            var dx = p1.x - p2.x, dy = p1.y - p2.y, dist_p = p1.radius + p2.radius;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= dist_p) {
                p1.vx = -p1.vx;
                p1.vy = -p1.vy;
                p2.vx = -p2.vx;
                p2.vy = -p2.vy;
            }
        };
        /// Adds a specified amount of particles
        this.pushParticles = function (nb, pos) {
            if (pos === void 0) { pos = null; }
            _this.settings.particles.tmp.pushing = true;
            for (var i = 0; i < nb; i++) {
                _this.settings.particles.array.push(new particle_1.Particle(_this.settings.particles.opacity.value, _this, _this.settings.particles.color.value, {
                    'x': pos != null ? pos.pos_x : utils_1.randomFloat() * _this.canvasWidth,
                    'y': pos != null ? pos.pos_y : utils_1.randomFloat() * _this.canvasHeight
                }));
                if (i == nb - 1) {
                    if (!_this.settings.particles.move.enable) {
                        _this.particlesDraw();
                    }
                    _this.settings.particles.tmp.pushing = false;
                }
            }
            _this.settings.particles.array.sort(function (a, b) { return a.radius > b.radius ? 1 : -1; });
        };
        /* ---------- Particles functions - modes events ------------ */
        this.removeParticles = function (nb) {
            _this.settings.particles.array.splice(0, nb);
            if (!_this.settings.particles.move.enable) {
                _this.particlesDraw();
            }
        };
        this.bubbleParticle = function (p) {
            var dist_mouse, time_spent, value;
            if (_this.settings.interactivity.events.onhover.enable &&
                utils_1.isInArray('bubble', _this.settings.interactivity.events.onhover.mode) &&
                _this.settings.interactivity.status == 'mousemove') {
                var dx_mouse_1 = p.x - _this.settings.interactivity.mouse.pos_x, dy_mouse_1 = p.y - _this.settings.interactivity.mouse.pos_y;
                dist_mouse = Math.sqrt(dx_mouse_1 * dx_mouse_1 + dy_mouse_1 * dy_mouse_1);
                var ratio = 1 -
                    dist_mouse / _this.settings.interactivity.modes.bubble.distance;
                var init = function () {
                    p.opacity_bubble = p.opacity;
                    p.radius_bubble = p.radius;
                };
                if (dist_mouse <= _this.settings.interactivity.modes.bubble.distance) {
                    if (ratio >= 0 && _this.settings.interactivity.status == 'mousemove') {
                        if (_this.settings.interactivity.modes.bubble.size != _this.settings.particles.size.value) {
                            if (_this.settings.interactivity.modes.bubble.size > _this.settings.particles.size.value) {
                                var size = p.radius + (_this.settings.interactivity.modes.bubble.size * ratio);
                                if (size >= 0) {
                                    p.radius_bubble = size;
                                }
                            }
                            else {
                                var dif = p.radius - _this.settings.interactivity.modes.bubble.size, size = p.radius - (dif * ratio);
                                if (size > 0) {
                                    p.radius_bubble = size;
                                }
                                else {
                                    p.radius_bubble = 0;
                                }
                            }
                        }
                        if (_this.settings.interactivity.modes.bubble.opacity != _this.settings.particles.opacity.value) {
                            if (_this.settings.interactivity.modes.bubble.opacity > _this.settings.particles.opacity.value) {
                                var opacity = _this.settings.interactivity.modes.bubble.opacity * ratio;
                                if (opacity > p.opacity &&
                                    opacity <= _this.settings.interactivity.modes.bubble.opacity) {
                                    p.opacity_bubble = opacity;
                                }
                            }
                            else {
                                var opacity = p.opacity - (_this.settings.particles.opacity.value - _this.settings.interactivity.modes.bubble.opacity) * ratio;
                                if (opacity < p.opacity &&
                                    opacity >= _this.settings.interactivity.modes.bubble.opacity) {
                                    p.opacity_bubble = opacity;
                                }
                            }
                        }
                    }
                }
                else {
                    init();
                }
                if (_this.settings.interactivity.status == 'mouseleave') {
                    init();
                }
            }
            else if (_this.settings.interactivity.events.onclick.enable && utils_1.isInArray('bubble', _this.settings.interactivity.events.onclick.mode)) {
                if (_this.settings.tmp.bubble_clicking) {
                    var dx_mouse = p.x - _this.settings.interactivity.mouse.click_pos_x, dy_mouse = p.y - _this.settings.interactivity.mouse.click_pos_y;
                    dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);
                    time_spent = (Date.now() - _this.settings.interactivity.mouse.click_time) / 1000;
                    if (time_spent > _this.settings.interactivity.modes.bubble.duration) {
                        _this.settings.tmp.bubble_duration_end = true;
                    }
                    if (time_spent > _this.settings.interactivity.modes.bubble.duration * 2) {
                        _this.settings.tmp.bubble_clicking = false;
                        _this.settings.tmp.bubble_duration_end = false;
                    }
                }
                var process = function (bubble_param, particles_param, p_obj_bubble, p_obj, id, dist_mouse, time_spent, value) {
                    if (bubble_param != particles_param) {
                        if (!_this.settings.tmp.bubble_duration_end) {
                            if (dist_mouse <= _this.settings.interactivity.modes.bubble.distance) {
                                var obj = void 0;
                                if (p_obj_bubble != null) {
                                    obj = p_obj_bubble;
                                }
                                else {
                                    obj = p_obj;
                                }
                                if (obj != bubble_param) {
                                    var value_1 = p_obj - (time_spent * (p_obj - bubble_param) / _this.settings.interactivity.modes.bubble.duration);
                                    if (id == 'size')
                                        p.radius_bubble = value_1;
                                    if (id == 'opacity')
                                        p.opacity_bubble = value_1;
                                }
                            }
                            else {
                                if (id == 'size')
                                    p.radius_bubble = null;
                                if (id == 'opacity')
                                    p.opacity_bubble = null;
                            }
                        }
                        else {
                            if (p_obj_bubble != null) {
                                var value_tmp = p_obj - (time_spent * (p_obj - bubble_param) / _this.settings.interactivity.modes.bubble.duration), dif_1 = bubble_param - value_tmp;
                                value = bubble_param + dif_1;
                                if (id == 'size')
                                    p.radius_bubble = value;
                                if (id == 'opacity')
                                    p.opacity_bubble = value;
                            }
                        }
                    }
                };
                if (_this.settings.tmp.bubble_clicking) {
                    process(_this.settings.interactivity.modes.bubble.size, _this.settings.particles.size.value, p.radius_bubble, p.radius, 'size', dist_mouse, time_spent, value);
                    process(_this.settings.interactivity.modes.bubble.opacity, _this.settings.particles.opacity.value, p.opacity_bubble, p.opacity, 'opacity', dist_mouse, time_spent, value);
                }
            }
        };
        this.repulseParticle = function (p) {
            if (_this.settings.interactivity.events.onhover.enable &&
                utils_1.isInArray('repulse', _this.settings.interactivity.events.onhover.mode) &&
                _this.settings.interactivity.status == 'mousemove') {
                var dx_mouse = p.x - _this.settings.interactivity.mouse.pos_x, dy_mouse = p.y - _this.settings.interactivity.mouse.pos_y;
                var dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);
                var normVec = {
                    'x': dx_mouse / dist_mouse,
                    'y': dy_mouse / dist_mouse
                };
                var repulseRadius = _this.settings.interactivity.modes.repulse.distance, velocity = _this.settings.interactivity.modes.repulse.strength, repulseFactor = utils_1.clamp((1 / repulseRadius) * (-1 * Math.pow(dist_mouse / repulseRadius, 2) + 1) * repulseRadius * velocity, 0, 50);
                var pos = {
                    'x': p.x + normVec.x * repulseFactor,
                    'y': p.y + normVec.y * repulseFactor
                };
                if (_this.settings.particles.move.out_mode == 'bounce') {
                    if (pos.x - p.radius > 0 && pos.x + p.radius < _this.canvasWidth)
                        p.x = pos.x;
                    if (pos.y - p.radius > 0 && pos.y + p.radius < _this.canvasHeight)
                        p.y = pos.y;
                }
                else {
                    p.x = pos.x;
                    p.y = pos.y;
                }
            }
            else if (_this.settings.interactivity.events.onclick.enable &&
                utils_1.isInArray('repulse', _this.settings.interactivity.events.onclick.mode)) {
                if (!_this.settings.tmp.repulse_finish != null &&
                    _this.settings.tmp.repulse_finish) {
                    _this.settings.tmp.repulse_count++;
                    if (_this.settings.tmp.repulse_count == _this.settings.particles.array.length) {
                        _this.settings.tmp.repulse_finish = true;
                    }
                }
                if (_this.settings.tmp.repulse_clicking) {
                    var repulseRadius_1 = Math.pow(_this.settings.interactivity.modes.repulse.distance / 6, 3);
                    var dx_1 = _this.settings.interactivity.mouse.click_pos_x - p.x;
                    var dy_1 = _this.settings.interactivity.mouse.click_pos_y - p.y;
                    var d = dx_1 * dx_1 + dy_1 * dy_1;
                    var force_1 = -repulseRadius_1 / d * 1;
                    var process = function () {
                        var f = Math.atan2(dy_1, dx_1);
                        p.vx = force_1 * Math.cos(f);
                        p.vy = force_1 * Math.sin(f);
                        if (_this.settings.particles.move.out_mode == 'bounce') {
                            var pos = { 'x': p.x + p.vx, 'y': p.y + p.vy };
                            if (pos.x + p.radius > _this.canvasWidth) {
                                p.vx = -p.vx;
                            }
                            else if (pos.x - p.radius < 0)
                                p.vx = -p.vx;
                            if (pos.y + p.radius > _this.canvasHeight) {
                                p.vy = -p.vy;
                            }
                            else if (pos.y - p.radius < 0) {
                                p.vy = -p.vy;
                            }
                        }
                    };
                    if (d <= repulseRadius_1) {
                        process();
                    }
                }
                else {
                    if (_this.settings.tmp.repulse_clicking == false) {
                        p.vx = p.vxI;
                        p.vy = p.vyI;
                    }
                }
            }
        };
        this.grabParticle = function (p) {
            if (_this.settings.interactivity.events.onhover.enable &&
                utils_1.isInArray('grab', _this.settings.interactivity.events.onhover.mode) &&
                _this.settings.interactivity.status == 'mousemove') {
                var dx_mouse = p.x - _this.settings.interactivity.mouse.pos_x, dy_mouse = p.y - _this.settings.interactivity.mouse.pos_y, dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);
                if (dist_mouse <= _this.settings.interactivity.modes.grab.distance) {
                    var opacity_line = _this.settings.interactivity.modes.grab.line_linked.opacity -
                        (dist_mouse / (1 / _this.settings.interactivity.modes.grab.line_linked.opacity)) / _this.settings.interactivity.modes.grab.distance;
                    if (opacity_line > 0) {
                        var color_line = _this.settings.particles.line_linked.color_rgb_line;
                        _this.ctx.strokeStyle = "rgba(" + color_line.r + "," + color_line.g + "," + color_line.b + "," + opacity_line + ")";
                        _this.ctx.lineWidth = _this.settings.particles.line_linked.width;
                        /* path */
                        _this.ctx.beginPath();
                        _this.ctx.moveTo(p.x, p.y);
                        _this.ctx.lineTo(_this.settings.interactivity.mouse.pos_x, _this.settings.interactivity.mouse.pos_y);
                        _this.ctx.stroke();
                        _this.ctx.closePath();
                        if (_this.settings.interactivity.modes.grab.outer_shape.enable) {
                            _this.ctx.beginPath();
                            var shape = void 0;
                            if (_this.settings.interactivity.modes.grab.outer_shape.type != 'inherit') {
                                shape = _this.settings.interactivity.modes.grab.outer_shape.type;
                            }
                            else {
                                shape = p.shape;
                            }
                            if (_this.settings.interactivity.modes.grab.outer_shape.stroke.color != 'inherit') {
                                var color = utils_1.hexToRgb(_this.settings.interactivity.modes.grab.outer_shape.stroke.color);
                                _this.ctx.strokeStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + opacity_line + ")";
                            }
                            if (_this.settings.interactivity.modes.grab.outer_shape.stroke.width != 'inherit') {
                                _this.ctx.lineWidth = _this.settings.interactivity.modes.grab.outer_shape.stroke.width;
                            }
                            p.drawShape(shape, _this.settings.interactivity.modes.grab.outer_shape.size + p.radius, true);
                            _this.ctx.stroke();
                            _this.ctx.closePath();
                        }
                    }
                }
            }
        };
        this.eventsListeners = function () {
            if (_this.settings.interactivity.detect_on == 'window') {
                _this.settings.interactivity.el = window;
            }
            else {
                _this.settings.interactivity.el = _this.canvas;
            }
            if (_this.settings.interactivity.events.onhover.enable ||
                _this.settings.interactivity.events.onclick.enable) {
                _this.settings.interactivity.el.addEventListener('mousemove', function (e) {
                    var pos_x = e.clientX, pos_y = e.clientY;
                    if (_this.settings.interactivity.detect_on == 'window') {
                        pos_x = e.clientX;
                        pos_y = e.clientY;
                    }
                    else {
                        pos_x = e.offsetX || e.clientX;
                        pos_y = e.offsetY || e.clientY;
                    }
                    _this.settings.interactivity.mouse.pos_x = pos_x;
                    _this.settings.interactivity.mouse.pos_y = pos_y;
                    if (_this.settings.tmp.retina) {
                        _this.settings.interactivity.mouse.pos_x *= _this.pxratio;
                        _this.settings.interactivity.mouse.pos_y *= _this.pxratio;
                    }
                    _this.settings.interactivity.status = 'mousemove';
                });
                _this.settings.interactivity.el.addEventListener('mouseleave', function (e) {
                    _this.settings.interactivity.mouse.pos_x = null;
                    _this.settings.interactivity.mouse.pos_y = null;
                    _this.settings.interactivity.status = 'mouseleave';
                });
            }
            if (_this.settings.interactivity.events.onclick.enable) {
                _this.settings.interactivity.el.addEventListener('click', function (e) {
                    _this.settings.interactivity.mouse.click_pos_x = _this.settings.interactivity.mouse.pos_x;
                    _this.settings.interactivity.mouse.click_pos_y = _this.settings.interactivity.mouse.pos_y;
                    _this.settings.interactivity.mouse.click_time = Date.now();
                    if (_this.settings.interactivity.events.onclick.enable) {
                        if (utils_1.isInArray('push', _this.settings.interactivity.events.onclick.mode)) {
                            if (_this.settings.particles.move.enable) {
                                _this.pushParticles(_this.settings.interactivity.modes.push.particles_nb, _this.settings.interactivity.mouse);
                            }
                            else {
                                if (_this.settings.interactivity.modes.push.particles_nb == 1) {
                                    _this.pushParticles(_this.settings.interactivity.modes.push.particles_nb, _this.settings.interactivity.mouse);
                                }
                                else if (_this.settings.interactivity.modes.push.particles_nb > 1) {
                                    _this.pushParticles(_this.settings.interactivity.modes.push.particles_nb);
                                }
                            }
                        }
                        if (utils_1.isInArray('remove', _this.settings.interactivity.events.onclick.mode)) {
                            _this.removeParticles(_this.settings.interactivity.modes.remove.particles_nb);
                        }
                        if (utils_1.isInArray('bubble', _this.settings.interactivity.events.onclick.mode)) {
                            _this.settings.tmp.bubble_clicking = true;
                        }
                        if (utils_1.isInArray('repulse', _this.settings.interactivity.events.onclick.mode)) {
                            _this.settings.tmp.repulse_clicking = true;
                            _this.settings.tmp.repulse_count = 0;
                            _this.settings.tmp.repulse_finish = false;
                            setTimeout(function () {
                                _this.settings.tmp.repulse_clicking = false;
                            }, Math.round(_this.settings.interactivity.modes.repulse.duration * 1000));
                        }
                    }
                });
            }
        };
        this.densityAutoParticles = function () {
            if (_this.settings.particles.number.density.enable) {
                var area = _this.canvas.width * _this.canvas.height / 1000;
                if (_this.settings.tmp.retina) {
                    area = area / (_this.pxratio * 2);
                }
                var nb_particles = Math.floor(area * _this.settings.particles.number.value / _this.settings.particles.number.density.value_area);
                var missing_particles = _this.settings.particles.array.length - nb_particles;
                if (missing_particles < 0) {
                    _this.pushParticles(Math.abs(missing_particles));
                }
                else {
                    _this.removeParticles(missing_particles);
                }
            }
        };
        /// Stops drawing the particles and removes the [canvas]
        this.destroyParticles = function () {
            window.cancelAnimationFrame(_this.drawAnimFrame);
            _this.canvas.remove();
        };
        /// Opens the current image displaying in the [canvas] in a new tab
        this.exportImg = function () {
            window.open(_this.canvas.toDataURL('image/png'), '_blank');
        };
        this.loadImg = function (type) {
            _this.settings.tmp.img_error = null;
            if (_this.settings.particles.shape.image.src != '') {
                if (type == 'svg') {
                    var req_1 = new XMLHttpRequest;
                    req_1.open('GET', _this.settings.particles.shape.image.src);
                    req_1.addEventListener('onreadystatechange', function (data) {
                        if (req_1.readyState == 4) {
                            if (req_1.status == 200) {
                                _this.settings.tmp.source_svg = req_1.response;
                                _this.checkBeforeDraw();
                            }
                            else {
                                console.log('Error Particles - Image not found');
                                _this.settings.tmp.img_error = true;
                            }
                        }
                    });
                    req_1.send();
                }
                else {
                    var img_1 = new Image();
                    img_1.addEventListener('load', function (e) {
                        _this.settings.tmp.img_obj = img_1;
                        _this.checkBeforeDraw();
                    });
                    img_1.src = _this.settings.particles.shape.image.src;
                }
            }
            else {
                console.log('Error Particles - No image.src');
                _this.settings.tmp.img_error = true;
            }
        };
        /**
         * A function that will run every frame.
         * Meant to be replaced with another function
         */
        this.everyFrame = function () { };
        this.draw = function (_) {
            if (_ === void 0) { _ = null; }
            if (_this.settings.particles.shape.type == 'image') {
                if (_this.settings.tmp.img_type == 'svg') {
                    if (_this.settings.tmp.count_svg >=
                        _this.settings.particles.number.value) {
                        _this.particlesDraw();
                        if (!_this.settings.particles.move.enable) {
                            window.cancelAnimationFrame(_this.drawAnimFrame);
                        }
                        else {
                            _this.drawAnimFrame = window.requestAnimationFrame(_this.draw);
                        }
                    }
                    else {
                        if (!_this.settings.tmp.img_error) {
                            _this.drawAnimFrame = window.requestAnimationFrame(_this.draw);
                        }
                    }
                }
                else {
                    if (_this.settings.tmp.img_obj != null) {
                        _this.particlesDraw();
                        if (!_this.settings.particles.move.enable) {
                            window.cancelAnimationFrame(_this.drawAnimFrame);
                        }
                        else {
                            _this.drawAnimFrame = window.requestAnimationFrame(_this.draw);
                        }
                    }
                    else {
                        if (!_this.settings.tmp.img_error) {
                            _this.drawAnimFrame = window.requestAnimationFrame(_this.draw);
                        }
                    }
                }
            }
            else {
                _this.particlesDraw();
                if (!_this.settings.particles.move.enable) {
                    window.cancelAnimationFrame(_this.drawAnimFrame);
                }
                else {
                    _this.drawAnimFrame = window.requestAnimationFrame(_this.draw);
                }
            }
            _this.everyFrame();
        };
        this.checkBeforeDraw = function () {
            if (_this.settings.particles.shape.type == 'image') {
                if (_this.settings.tmp.img_type == 'svg' &&
                    _this.settings.tmp.source_svg == null) {
                    _this.settings.tmp.checkAnimFrame = window.requestAnimationFrame(_this.settings.tmp.checkAnimFrame);
                }
                else {
                    window.cancelAnimationFrame(_this.settings.tmp.checkAnimFrame);
                    if (!_this.settings.tmp.img_error) {
                        _this.init();
                        _this.draw();
                    }
                }
            }
            else {
                _this.init();
                _this.draw();
            }
        };
        this.init = function () {
            _this.settings.particles.line_linked.color_rgb_line = utils_1.hexToRgb(_this.settings.particles.line_linked.color);
            _this.settings.tmp.obj = {
                'size_value': _this.settings.particles.size.value,
                'size_anim_speed': _this.settings.particles.size.anim.speed,
                'move_speed': _this.settings.particles.move.speed,
                'line_linked_distance': _this.settings.particles.line_linked.distance,
                'line_linked_width': _this.settings.particles.line_linked.width,
                'mode_grab_distance': _this.settings.interactivity.modes.grab.distance,
                'mode_bubble_distance': _this.settings.interactivity.modes.bubble.distance,
                'mode_bubble_size': _this.settings.interactivity.modes.bubble.size,
                'mode_repulse_distance': _this.settings.interactivity.modes.repulse.distance
            };
            _this.retinaInit();
            _this.canvasSize();
            _this.canvasPaint();
            _this.particlesCreate();
            _this.densityAutoParticles();
        };
        this.begin = function () {
            if (utils_1.isInArray('image', _this.settings.particles.shape.type)) {
                _this.settings.tmp.img_type = _this.settings.particles.shape.image.src.substring(_this.settings.particles.shape.image.src.length - 3);
                _this.loadImg(_this.settings.tmp.img_type);
            }
            else {
                _this.checkBeforeDraw();
            }
        };
        return this;
    }
    return Particles;
}());
exports.Particles = Particles;
