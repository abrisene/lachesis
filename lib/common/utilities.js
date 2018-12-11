/*
 # utilities.js
 # Utility Methods
 */


/**
 * Checks whether an array of items have any non-undefined or empty values.
 * @param  {array} items An array of items.
 * @return {bool}        Returns true or false
 */
const exists = (items) => {
  let result;
  if (Array.isArray(items)) {
    result = items.some(i => i !== undefined && i !== '');
  } else {
    result = items !== undefined && items !== '';
  }
  return result;
};

/**
 * Tries to parse JSON, returns undefined if input is invalid.
 * @param  {string} string  String to be parsed.
 * @return {object}         Returns JSON or undefined
 */
const jsonTryParse = (string) => {
  try {
    const json = JSON.parse(string);
    return json;
  } catch (err) {
    return undefined;
  }
};

/**
 # Module Exports
 */

module.exports = {
  exists,
  jsonTryParse,
};
