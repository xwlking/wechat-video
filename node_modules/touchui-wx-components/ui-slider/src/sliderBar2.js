import OTS from './objectToStyle.js'
module.exports = Behavior({

  data: {
    sliderBarWrapStyle: ''
  },
  methods: {
    sliderBarWrap2DynamicStyleObj() {
      let style = {}
      style['z-index'] = this.data.zIndex2
      style['transform'] = `translate3d(${this.data.offset2X}px, 0, 0)`
      style.height = '30px'
      style.width = '30px'
      return style
    }
  },
})