export const STRANDS_INTERNAL_NAME_PREFIX = '_p5_strands_';


/**
 * @private
 * @typedef {Object} StrandsShaderNameMap
 * @property {Object} externalToInternal Maps external shader names to internal shader names.
 *   e.g. `shaderNameMap.externalToInternal['__data'] = '_p5_strands_0'`
 * @property {Object} internalToExternal Maps internal shader names to external shader names.
 *   e.g. `shaderNameMap.internalToExternal['_p5_strands_0'] = '__data'`
 */

/**
 * Creates and returns a new `shaderNameMap` object for managing
 * the mapping between external and internal shader variable names.
 *
 * `shaderNameMap` can resolve names in both directions:
 * - `shaderNameMap.externalToInternal['__data']` -> `_p5_strands_0`
 * - `shaderNameMap.internalToExternal['_p5_strands_0']` -> `__data`
 *
 * @private
 * @return {StrandsShaderNameMap} A new `shaderNameMap` object with empty mappings.
 */
export function createStrandsShaderNameMap() {
  return {
    externalToInternal: {},
    internalToExternal: {}
  };
}

/**
 * @private
 * @typedef {Object} StrandsShaderNameState
 * @property {Number} nextSuffix - The next suffix number to use for generating unique internal shader names.
 */

/**
 * Creates and returns a new `shaderNameState` object containing the next
 * suffix number for generating unique internal shader names.
 *
 * @private
 * @param {Number} [nextSuffix] The next suffix number to use for generating
 *   unique internal shader names. Defaults to 0.
 * @return {StrandsShaderNameState} A new `shaderNameState` object with the provided next suffix.
 */
export function createStrandsShaderNameState(nextSuffix = 0) {
  // Keep suffix state in an object to allow mutation across different contexts
  // without needing to return and reassign the updated value.
  return { nextSuffix };
}

/**
 * Checks if a given name is an internally reserved strands name.
 *
 * - `_p5_strands_` prefix is reserved for creating safe internal shader variable names.
 * For example, names with two underscores are internally rewritten to `_p5_strands_<incrementing number>`.
 * - `gl_` prefix is reserved by WebGL and it is used in the shader templates.
 * It shouldn't be used for user-defined variables to avoid conflicts.
 *
 * @private
 * @param {String} name The name to check.
 * @return {Boolean} True if the name is reserved, false otherwise.
 */
export function isReservedStrandsName(name) {
  return (
    typeof name === 'string' &&
    (
      name.startsWith(STRANDS_INTERNAL_NAME_PREFIX) ||
      name.startsWith('gl_')
    )
  );
}

/**
 * Checks if a given name is a safe shader identifier.
 *
 * @private
 * @param {String} name The name to check.
 * @returns {Boolean} True if the name is a safe shader identifier, false otherwise.
 */
export function isSafeShaderIdentifier(name) {
  return (
    typeof name === 'string' &&
    /^[_A-Za-z][_A-Za-z0-9]*$/.test(name) &&
    !name.includes('__') &&
    !isReservedStrandsName(name)
  );
}

/**
 * Retrieves or creates a safe internal shader name for a given external name.
 *
 * If the original name is already a safe shader identifier, it is returned as-is.
 * Otherwise, a new unique internal name is generated, stored in the name map, and returned.
 *
 * @private
 * @param {StrandsShaderNameMap} nameMap The shader name map object.
 * @param {StrandsShaderNameState} nameState The shader name state object.
 * @param {String} originalName The original external name to convert to an internal name.
 * @returns {String} The internal shader name that is safe to use in shader code.
 */
export function getOrCreateInternalShaderName(
  nameMap,
  nameState,
  originalName
) {
  if (nameMap.externalToInternal[originalName]) {
    return nameMap.externalToInternal[originalName];
  }

  if (isSafeShaderIdentifier(originalName)) {
    return originalName;
  }

  const internalName = `${STRANDS_INTERNAL_NAME_PREFIX}${nameState.nextSuffix++}`;

  nameMap.externalToInternal[originalName] = internalName;
  nameMap.internalToExternal[internalName] = originalName;
  return internalName;
}
