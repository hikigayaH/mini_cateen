// component/preview/preview.js
Component({
  /**
   * 组件的属性列表
   */

  properties: {
    order_item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onTapOrder() {
      const order_item = this.data.order_item;
      console.log(order_item)
      wx.navigateTo({
        url: '../order_detail/order_detail',
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', order_item)
        }
      })
    }
  }
})