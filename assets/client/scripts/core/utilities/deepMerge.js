/* eslint-disable no-use-before-define */
/**
 * Verify if the argument is mergeable
 * @param {Object} val Object to be merged
 * @returns {boolean} - Mergeable object
 */
function isMergeableObject(val) {
    const nonNullObject = val && typeof val === 'object';

    return nonNullObject
        && Object.prototype.toString.call(val) !== '[object RegExp]'
        && Object.prototype.toString.call(val) !== '[object Date]';
}

/**
 * Verify if object is empty
 * @param {Object} val - Object to check
 * @returns {boolean} - check if object is empty or not
 */
function emptyTarget(val) {
    return Array.isArray(val) ? [] : {};
}

/**
 * copy the object instead of modifying source object
 * @param {Object} value - Object to be cloned
 * @param {Object} optionsArgument - Options
 * @returns {Object} - Source or cloned object
 */
function cloneValue(value, optionsArgument) {
    const clone = optionsArgument && optionsArgument.clone === true;
    return (clone && isMergeableObject(value)) ? deepMerge(emptyTarget(value), value, optionsArgument) : value;
}

/**
 * Merge the object
 * @param {Object} target - Destination object
 * @param {Object} source - Source Object
 * @param {Object} optionsArgument - options
 * @returns {Object} - Final object
 */
function mergeObject(target, source, optionsArgument) {
    const destination = {};
    if (isMergeableObject(target)) {
        Object.keys(target).forEach((key) => {
            destination[key] = cloneValue(target[key], optionsArgument);
        });
    }
    Object.keys(source).forEach((key) => {
        if (!isMergeableObject(source[key]) || !target[key]) {
            destination[key] = cloneValue(source[key], optionsArgument);
        } else {
            destination[key] = deepMerge(target[key], source[key], optionsArgument);
        }
    });
    return destination;
}

/**
 * Merge array
 * @param {Object} target - Destination object
 * @param {Object} source - Source Object
 * @param {Object} optionsArgument - options
 * @returns {Array} Get the merged array
 */
function defaultArrayMerge(target, source, optionsArgument) {
    const destination = target.slice();
    source.forEach((e, i) => {
        if (typeof destination[i] === 'undefined') {
            destination[i] = cloneValue(e, optionsArgument);
        } else if (isMergeableObject(e)) {
            destination[i] = deepMerge(target[i], e, optionsArgument);
        } else if (target.indexOf(e) === -1) {
            destination.push(cloneValue(e, optionsArgument));
        }
    });
    return destination;
}

/**
 * Deep Merge Object
 * @param {Object} target - Destination object
 * @param {Object} source - Source Object
 * @param {Object} optionsArgument - options
 * @returns {Array|Object} Get the merged Object
 */
export function deepMerge(target, source, optionsArgument) {
    const array = Array.isArray(source);
    const options = optionsArgument || { arrayMerge: defaultArrayMerge };
    const arrayMerge = options.arrayMerge || defaultArrayMerge;

    if (array) {
        return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneValue(source, optionsArgument);
    }

    return mergeObject(target, source, optionsArgument);
}
