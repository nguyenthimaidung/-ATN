export class Transforms {
  static number(value, obj, transformationType, onerr?: () => any) {
    const isNumeric = ['string', 'number'].includes(typeof value) && !isNaN(+value) && isFinite(+value)
    !isNumeric && onerr && onerr()
    return isNumeric ? +value : value
  }

  static integer(value, obj, transformationType, onerr?: () => any) {
    const isNumeric = ['string', 'number'].includes(typeof value) && Number.isInteger(+value)
    !isNumeric && onerr && onerr()
    return isNumeric ? parseInt(value) : value
  }

  static long(value, obj, transformationType, onerr?: () => any) {
    const isNumeric = ['string', 'number'].includes(typeof value) && Number.isSafeInteger(+value)
    !isNumeric && onerr && onerr()
    return isNumeric ? +value : value
  }

  static boolean(value, obj, transformationType, onerr?: () => any) {
    const isBoolean =
      ['string', 'boolean'].includes(typeof value) && ['TRUE', 'true', '1', 'FALSE', 'false', '0'].includes(`${value}`)
    !isBoolean && onerr && onerr()
    return !isBoolean ? value : ['TRUE', 'true', '1'].includes(`${value}`) ? true : false
  }

  static object(value, obj, transformationType, onerr?: () => any) {
    try {
      const isString = typeof value === 'string'
      !isString && onerr && onerr()
      return isString ? JSON.parse(value) : value
    } catch (err) {
      onerr && onerr()
      return value
    }
  }
}
