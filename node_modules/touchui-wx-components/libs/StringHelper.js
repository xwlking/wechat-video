export default class StringHelper {

  static isNumber (str) {
    return /^\d+(\.\d+)?$/.test(str)
  }

  static getLength (str) {
    return str.toString().length
  }

  static camelCase2Dash (str) {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
  }

  static dash2CamelCase (str) {
    return str.replace(/\-([a-z])/gi, function (m, w) {
      return w.toUpperCase()
    })
  }
}