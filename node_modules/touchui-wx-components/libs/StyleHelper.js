import StringHelper from './StringHelper'
import merge from 'lodash.merge'
import trim from 'lodash.trim'

const SizeAttrs = ['height', 'width', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'top', 'right', 'bottom', 'left', 'lineHeight', 'fontSize']
const DashedSizeAttrs = SizeAttrs.map((attr) => {
  return StringHelper.camelCase2Dash(attr)
})


function getUnitizedValue (value) {
  if (/^\d+(\.\d+)?$/.test(value)) {
    return value + 'px'
  } else {
    return value
  }
}

function getObjectStyle (target) {
  if (typeof target === 'object') {
    return target
  }
  let attrs = target.split(';')
  let obj = {}

  attrs.forEach((attr) => {
    let pairs = attr.split(':')
    if (pairs.length === 2) {
      let key = trim(pairs[0])
      let value = trim(pairs[1])
 
      if (key && value) {
        obj[key] = value
      }
    }
  })
  return obj
}

export default class StyleHelper {
  static getPlainStyle (target) {
    if (!target) {
      return ''
    }
    let style = ''
    let type = typeof target
    if (type === 'string') {
      style = target
    } else if (type === 'object') {
      let dashAttr = ''
      Object.keys(target).forEach((attr) => {
        dashAttr = StringHelper.camelCase2Dash(attr)

        if (target[attr]) {
          if (DashedSizeAttrs.indexOf(dashAttr) > -1 || SizeAttrs.indexOf(attr) > -1) {
            style += `${dashAttr}: ${getUnitizedValue(target[attr])};`
          } else {
            style += `${dashAttr}: ${target[attr]};`
          }
        }
      })
    }
    return style
  }
  static getMergedPlainStyles (targets) {
    let objectStyles = targets.map((target) => {
      return getObjectStyle(target)
    })
    let mergedStyles = merge({}, ...objectStyles)
    return StyleHelper.getPlainStyle(mergedStyles)
  }
}