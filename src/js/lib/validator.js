export const isObject = n => n::Object.prototype.toString() === '[object Object]';
export const isFunction = n => typeof n === 'function';
export const isString = n => typeof n === 'string';
export const isNumber = n => typeof n === 'number' && n === n;
export const isEmptyString = n => n === '';
export const isValid = n => !!n; 
//export const isValid = n => n !== undefined && n!== null && n === n; // undefined | null | NaN

