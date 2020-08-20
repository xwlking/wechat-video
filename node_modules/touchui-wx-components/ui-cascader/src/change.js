export default function (old) {
  // let roldstr = JSON.stringify(old)
  // let rold = JSON.parse(roldstr)

  var array = []
  var data = {}
  var wating = {}
  const BEFORE = 'id'
  old.forEach(ele => {
      let element = {}
      element.name = ele.name
      element.value = ele.value
      if (ele.parent) {
          element.parent = ele.parent
      }
      var value = element.value
      data[`${BEFORE}${value}`] = element
      var parent = element.parent
      var watingEls = wating[`${BEFORE}${value}`]
      if(watingEls) {
          element.children = watingEls
      }
      if(!parent) {
          array.push(element)
      } else {
          let parentEl = data[`${BEFORE}${parent}`]
          if(parentEl) {
              if(!parentEl.children) {
                  parentEl.children = []
              }
              parentEl.children.push(element)
          } else {
              if(!wating[`${BEFORE}${parent}`]) {
                  wating[`${BEFORE}${parent}`] = []
              }
              wating[`${BEFORE}${parent}`].push(element)
          }
      }
  })

  return array
}