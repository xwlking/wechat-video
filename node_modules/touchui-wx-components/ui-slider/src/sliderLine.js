module.exports = Behavior({
  data: {
    sliderLineTouchStyle: '',
    sliderLineBackgroundStyle: '',
    sliderLineStyle: '',
  },
  methods: {
    touchMoveHandler(e) {
      // this.
    },
    touchStartHandler(e) {
    },
    sliderLineStyleObj() {
      let style = {}
      style['background-color'] = this.data.activeColor
      style.top = (this.data.thumbSize / 2 - this.data.sliderWeight / 2) + 'px'
      style.height = this.data.sliderWeight + 'px'
      // style.left = this.data.valueAlignLeft + 'px'
      style['border-radius'] = this.data.barBorderRadius + 'px'
       return style
    },
    sliderLineBackgroundStyleObj() {
      let style = {}
      style['background-color'] = this.data.backgroundColor
      // style.left = this.data.valueAlignLeft + 'px'
      style.top = (this.data.thumbSize / 2 - this.data.sliderWeight / 2) + 'px'
      style.height = this.data.sliderWeight + 'px'
      style['border-radius'] = this.data.barBorderRadius + 'px'
      return style
    },
    sliderLineTouchStyleObj () {
      let style = {}
      style.left = this.data.valueAlignLeft + 'px'
      style.top = (this.data.height / 2 - this.data.thumbSize / 2) + 'px'
      style.height = this.data.thumbSize + 'px'

      // style.left = this.data.showValue && (this.data.valuePos === 'left' || this.data.showMaxValue) ? + this.data.valueAlignLeft + 'px' : '0'
      style.width = `${this.data.width - this.data.valueAlignWidth}px`
      return style
    },
    sliderLineDynamicStyleObj() {
      let style = {}
      style['background-color'] = this.data.activeColor
      style.width = this.data.offsetX + 'px'
      style.left = this.data.offsetX + 'px'
      style.width = this.data.offset2X - this.data.offsetX + 'px'
      return style
    },
    sliderLineScaleWrapStyleObj() {
      let style = {}
      // style.left = this.data.valueAlignLeft + 'px'
      style.top = (this.data.thumbSize / 2 + this.data.sliderWeight / 2) + 'px'
      return style
    },
    sliderLineScaleStyle() {
      let style = {}
      style['background-color'] = '#ccc'
      style.height = 4 + 'px'
      style.width = 1 + 'px'
      return style
    },
    sliderBufferLineStyleObj () {
      let style = {}
      style['background-color'] = this.data.bufferColor
      console.log(this.data.bufferColor)
      // style.left = this.valueAlignLeft + 'px'
      style.top = (this.data.thumbSize / 2 - this.data.sliderWeight / 2) + 'px'
      style.height = this.data.sliderWeight + 'px'
      style['border-radius'] = this.data.barBorderRadius + 'px'
      style.width = this.value2Offset(this.data.bufferValue) + 'px'
      return style
    },
  }
})