// pages/Manager/M_order/M_exorder/M_exorder.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  handlefocus() {
    this.setData({
      active: 1
    })
  },
  handleblur() {
    this.setData({
      active: 0
    })
  },
  bindStartDateChange(e) {

  },
  bindEndDateChange(e) {

  },
  partexport(e) {
    
  },
  allexport() {
    wx.request({
      url: app.globalData.host + '/morder/all',
      header: {
        Authorization: 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      success: () => {
        wx.downloadFile({
          url: app.globalData.host + '/execl_data/o.xlsx',
          success(res) {
            console.log(res)
            const filePath = res.tempFilePath
            if (res.statusCode === 200){
              wx.saveFile({
                tempFilePath: filePath,
                success(res) {
                  const savedFilePath = res.savedFilePath
                  console.log(savedFilePath);
                  console.log(res);
                  wx.openDocument({
                    filePath: savedFilePath,
                    fileType: 'xlsx',
                    success: function (res) {
                      console.log('打开文档成功')
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  }
})