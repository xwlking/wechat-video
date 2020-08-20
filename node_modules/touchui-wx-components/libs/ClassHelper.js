export default class ClassHelper {
  static getPlainClass(staticClasses, objClasses) {
    let classes = staticClasses.join(' ')
    Object.keys(objClasses).forEach((key) => {
      classes += ` {{ ${key} ? '${objClasses[key]}' : '' }}`
    })
    return classes
  }
}