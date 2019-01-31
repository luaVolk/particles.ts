import { Conf, RGB } from './interfaces';

export function randomInt(max : number = 1) : number {
  return Math.floor(Math.random() * max)
}

export function randomFloat(max : number = 1) : number {
  return Math.random() * max
}

export function hexToRgb(hex : string) : RGB {
  hex = hex.replace(/'^#?([a-f\d])([a-f\d])([a-f\d])$'/gi, (m) => {
    console.log(m[1] + m[1] + m[2] + m[2] + m[3] + m[3]);
    
    return m[1] + m[1] + m[2] + m[2] + m[3] + m[3];
  });
  
  let result : Array<string> = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result != null
      ? {
          'r': parseInt(result[1], 16),
          'g': parseInt(result[2], 16),
          'b': parseInt(result[3], 16)
        }
      : null;
}

export function deepExtend(destination: Conf, source : Map<any, any>) : Conf {
  for (let property in source) {
    if (source[property] && source[property].constructor &&
     source[property].constructor === Object) {
      destination[property] = destination[property] || {};
      arguments.callee(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
};

export function clamp(number : number, min : number, max : number) : number {
  return Math.min(Math.max(number, min), max);
};

export function isInArray(value : any, array : string | Array<any>) : boolean {
  return array.indexOf(value) > -1;
}