

import OTS from './objectToStyle.js'
module.exports = Behavior({
  properties: {
    showValue: {
      type: Boolean,
        value: false
    },
    value: {
      type: [Number, Array],
      value: 0,
      observer (val) {
        console.log(val)
        if (this.data.showDoubleBarWrap) {
          this.data.offsetX = Number(this.data.value[0] - this.data.min) / (this.data.max - this.data.min) * (this.data.width - this.data.valueAlignWidth)
          this.data.offset2X = Number(this.data.value[1] - this.data.min) / (this.data.max - this.data.min) * (this.data.width - this.data.valueAlignWidth)
        } else {
          this.data.offset2X = Number(this.data.value - this.data.min) / (this.data.max - this.data.min) * (this.data.width - this.data.valueAlignWidth)
        }
        

        this.setData({
          offset2X: this.data.offset2X,
          offsetX: this.data.offsetX,
          value: val,
          sliderBarAnimateStyle: OTS(this.sliderBarAnimateStyleObj()),
          sliderBarWrapStyle: OTS(this.sliderBarWrapStyleObj()),
          sliderBarWrapDynamicStyle: OTS(this.sliderBarWrapDynamicStyleObj()),
          sliderLineDynamicStyle: OTS(this.sliderLineDynamicStyleObj()),          
          sliderBarAnimateStyle: OTS(this.sliderBarAnimateStyleObj()),
          sliderBarWrap2DynamicStyle: OTS(this.sliderBarWrap2DynamicStyleObj()),
          sliderLineDynamicStyle: OTS(this.sliderLineDynamicStyleObj()),
          thumbDownCustomStyle: ''
        })
      }
    },
    showMaxValue: {
      type: Boolean,
        value: false
    },
    valuePos: {
      type: String,
        value: 'right'
    },
    sliderWeight: {
      type: Number,
        value: 2
    },
    backgroundColor: {
      type: String,
        value: '#CCC'
    },
    barBorderRadius: {
      type: Number,
        value: 1
    },
    thumbSize: {
      type: Number,
      value: 28
    },
    showTooltip: {
      type: Boolean,
      value: false
    },
    activeColor: {
      type: String,
    },
    height: {
      type: Number,
        value: 70
    },
    width: {
      type: Number,
        value: 260
    },
    min: {
      type: Number,
        value: 0
    },
    max: {
      type: Number,
        value: 100
    },
    step: {
      type: Number,
        value: 1
    },
    keyScaleLine: {
      type: Number,
        value: 0
    },
    scaleLine: {
      type: Number,
        value: 0
    },
    thumbStyle: {
      type: Object,
      value: {}
    },
    thumbDownStyle: {
      type: Object,
      value: {}
    },
    tooltipStyle: {
      type: Object,
      value: {}
    },
    scalePosition: {
      type: String,
      value: 'under'
    },
    scaleMargin: {
      type: Number,
      value: 0
    },
    unlimited: {
      type: Boolean,
      value: false
    },
    bufferValue: {
      type: Number,
      value: 0,
      observer (val) {
        if (val > this.data.max) {
          val = this.data.max
        }
        this.data.bufferValue = val
        this.setData({
          sliderBufferLineStyle: OTS(this.sliderBufferLineStyleObj())
        })
        console.log(this.data.sliderBufferLineStyle)
      }
    },
    bufferColor: {
      type: String,
      value: 'green'
    }
  }
})