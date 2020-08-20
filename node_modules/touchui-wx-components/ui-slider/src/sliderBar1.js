

  import OTS from './objectToStyle.js'
  module.exports = Behavior({

  data: {
    sliderBarWrapStyle: ''
  },
  methods: {
    sliderBarWrapDynamicStyleObj() {
      let style = {}
      style['z-index'] = this.data.zIndex
      style['transform'] = `translate3d(${this.data.offsetX}px, 0, 0)`
      style.height = '30px'
      style.width = '30px'
      return style
    },
  },
})