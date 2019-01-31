exports.__esModule = true;
function randomInt(max) {
    if (max === void 0) { max = 1; }
    return Math.floor(Math.random() * max);
}
exports.randomInt = randomInt;
function randomFloat(max) {
    if (max === void 0) { max = 1; }
    return Math.random() * max;
}
exports.randomFloat = randomFloat;
function hexToRgb(hex) {
    hex = hex.replace(/'^#?([a-f\d])([a-f\d])([a-f\d])$'/gi, function (m) {
        console.log(m[1] + m[1] + m[2] + m[2] + m[3] + m[3]);
        return m[1] + m[1] + m[2] + m[2] + m[3] + m[3];
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result != null
        ? {
            'r': parseInt(result[1], 16),
            'g': parseInt(result[2], 16),
            'b': parseInt(result[3], 16)
        }
        : null;
}
exports.hexToRgb = hexToRgb;
function deepExtend(destination, source) {
    for (var property in source) {
        if (source[property] && source[property].constructor &&
            source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            arguments.callee(destination[property], source[property]);
        }
        else {
            destination[property] = source[property];
        }
    }
    return destination;
}
exports.deepExtend = deepExtend;
;
function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}
exports.clamp = clamp;
;
function isInArray(value, array) {
    return array.indexOf(value) > -1;
}
exports.isInArray = isInArray;
