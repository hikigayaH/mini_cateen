// pages/M_order/M_order.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_content: ['早餐', '中餐', '晚餐'],
    cont_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const a = this.data;
    wx.request({
      url: app.globalData.host + '/morder',
      header: {
        Authorization: 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        offertime: this.data.nav_content[0]
      },
      method: 'POST',
      success: (res) => {
        console.log(res.data);
        a.cont_list = res.data.cont_list;
        this.setData({
          cont_list: a.cont_list,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onTapnav(e) {
    console.log(e.detail.title);
    const use_time = e.detail.title;
    const a = this.data;
    wx.request({
      url: app.globalData.host + '/morder',
      header: {
        Authorization: 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        offertime: use_time
      },
      method: 'POST',
      success: (res) => {
        console.log(res.data);
        a.cont_list = res.data.cont_list
        this.setData({
          cont_list: a.cont_list
        })
      }
    })
  },
  navigtoexdata(){
    wx.navigateTo({
      url: '/pages/Manager/M_order/M_exorder/M_exorder'
    })
  }
})