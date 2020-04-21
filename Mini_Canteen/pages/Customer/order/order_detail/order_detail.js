// pages/Customer/order/order_detail/order_detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_item: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const a = this.data;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', (order_item) => {
      a.order_item = order_item
      console.log(a.order_item)
      const icon_type = this.statusofBill();
      const text_status = a.order_item.status;
      const content_list = (a.order_item.content).split(" | ");
      this.setData({
        icon_type,
        text_status,
        fund: a.order_item.fund,
        time: a.order_item.buildtime,
        bill_num: a.order_item.orderid,
        dealline: a.order_item.effecttime,
        content_list: content_list
      })
    })
  },

  onUnload: function() {
    clearTimeout(this.data.timer);
  },

  statusofBill() {
    const a = this.data;
    const usetime = new Date(a.order_item.effecttime).valueOf();
    const nowtime = Date.now();
    const rest = usetime - nowtime;
    if (rest < 0) {
      return "clear"
    } else if (0 <= rest && rest <= 33 * 60 * 60 * 1000) {
      return "waiting"
    } else if (rest > 33 * 60 * 60 * 1000) {
      return "success"
    }
  },

  onbtntap() {
    const a = this.data;
    const usetime = new Date(a.order_item.effecttime).valueOf();
    const nowtime = Date.now();
    const rest = usetime - nowtime;
    if (rest < 0) {
      wx.showToast({
        icon: 'none',
        title: '操作时间已过，禁止操作',
        duration: 2000
      })
    } else if (0 <= rest && rest <= 33 * 60 * 60 * 1000) {
      wx.showToast({
        icon: 'none',
        title: '操作时间已过，禁止操作',
        duration: 2000
      })
    } else if (rest > 33 * 60 * 60 * 1000) {
      wx.showModal({
        title: '提示',
        content: '确认取消订单',
        showCancel: true,
        cancelText: '返回',
        cancelColor: 'black',
        confirmText: '确定',
        confirmColor: 'red',
        success: function(res) {
          wx.request({
            url: app.globalData.host + '/bill/cancelbill',
            method: 'POST',
            header: {
              Authorization: 'Bearer ' + wx.getStorageSync('token')
            },
            data: {
              orderid: a.order_item.orderid,
            },
            success: (res) => {
              console.log(res);
              if (res.statusCode === 208) {
                wx.showToast({
                  icon: 'success',
                  title: '成功取消',
                  duration: 2000,
                  success: () => {
                    a.timer = setTimeout(function() {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 2000)
                  }
                })
              }
            }
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  }
})