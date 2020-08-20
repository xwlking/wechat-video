export default class {
  static getComponentRect (component, selector) {
    let query = wx.createSelectorQuery().in(component)

    return new Promise((resolve, reject) => {
      query.select(selector).boundingClientRect((res) => {
        resolve(res)
      }).exec()
    })
  }
  static getScrollViewRect (scrollView, selector) {
    let query = wx.createSelectorQuery().in(scrollView)

    return new Promise((resolve, reject) => {
      query.select(selector).scrollOffset((res) => {
        resolve(res)
      }).exec()
    })
  }
  static getParentRelation (path) {
    let relation = {}
    relation[path] = {
      type: 'parent'
    }
    return relation
  }
  static getChildRelation (path) {
    let relation = {}
    relation[path] = {
      type: 'child'
    }
    return relation
  }
}
