

  import OTS from './objectToStyle.js'
  module.exports = Behavior({

  data: {
  },
  methods: {
    sliderBarAnimateStyleObj() {
      let style = {}
      style['transition'] = this.data.animate
      return style
    },
    sliderBarWrapStyleObj() {
      let style = {}
      style.top = (this.data.height / 2 - this.data.thumbSize / 2) + 'px'
      style.left = this.data.valueAlignLeft - this.data.thumbSize / 2 + 'px'
      return style
    },
    sliderBarStyleObj() { 
      let style = {}
      style.height = this.data.thumbSize + 'px'
      style.width = this.data.thumbSize + 'px'
      return style
    }
  },
})