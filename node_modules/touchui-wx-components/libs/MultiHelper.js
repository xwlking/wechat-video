export default class MultiHelper {
  static getChildIndex (parent, child) {
    return parent.data.children.indexOf(child)
  }
  static callParent (child, method, ...args) {
    child.data.parent[method].apply(child.data.parent, args)
  }
  static updateChildActive (parent, activeIndex) {
    parent.data.children.forEach((child, index) => {
      if (activeIndex === index) {
        child.setData({
          active: true
        })
      } else {
        if (child.data.active) {
          child.setData({
            active: false
          })
        }
      }
    })
  }
}