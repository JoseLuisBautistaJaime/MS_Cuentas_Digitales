export const propGetDelete = (item, nameProp, defaultValue) => {
  let toReturn = defaultValue
  if (item !== undefined && item !== null) {
    const propValue = item[nameProp]
    if (propValue === undefined && propValue !== null) toReturn = propValue
  }
  return toReturn
}
