export class NumberHelper {
  static haveDot (num) {
    return num.toString().indexOf(".") === -1 ? false : true
  }
}