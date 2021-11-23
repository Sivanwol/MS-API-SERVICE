/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = ( value: string | number | object ): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys( value ).length) {
    return true;
  } else {
    return false;
  }
};
export const base_decode = ( str: string ): string => Buffer.from( str, 'base64' ).toString( 'binary' );
export const base_encode = ( str: string ): string => Buffer.from( str, 'binary' ).toString( 'base64' );
export const ObjectToArray = ( obj ) => Object.keys( obj ).map( ( key ) => [key, obj[key]] )
export const parseValidatedErrors = (errors) => {
  const returnErrorsParsed = []
  for (const error of errors) {
    const {constraints, property, children} = error
    const arr = ObjectToArray( constraints )
    arr.forEach( constraint => {
      returnErrorsParsed.push( {
        type: constraint[0],
        message: constraint[1],
        property
      } );
    } )
    if (children.length > 0) {
      for (const child of children) {
        const {constraints, property} = child
        const arr = ObjectToArray( constraints )
        arr.forEach( constraint => {
          returnErrorsParsed.push( {
            type: constraint[0],
            message: constraints[1],
            property
          } );
        } )
      }
    }
  }
  return returnErrorsParsed
}
