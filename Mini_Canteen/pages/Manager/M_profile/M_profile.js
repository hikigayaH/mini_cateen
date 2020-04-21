// pages/M_profile/M_profile.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('sendmanagerid', (user) => {
      this.data.managerid = user.managerid;
      this.setData({
        managerid: user.managerid
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changepassword(e) {
    let data = e.detail.value;
    data.managerid = this.data.managerid;
    console.log(this.data.managerid);
    console.log(data);
    if (data.psw_o && data.psw_n && data.psw_s) {
      if (data.psw_n !== data.psw_s) {
        wx.showToast({
          title: '输入密码不一致，请重新输入',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }
      else {
        wx.request({
          url: app.globalData.host + '/mprofile',
          data: data,
          method: 'POST',
          success: (res) => {
            if (res.data.success === 1) {
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 2000
              });
              this.data.timer = setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 2100)
            } else if (res.data.success === 0) {
              wx.showToast({
                title: '密码错误',
                icon: 'none',
                duration: 1500
              });
            }
          }
        })
      }
    } else {
      wx.showToast({
        title: '输入信息不能为空，请重新输入',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    }
  },
  handleOfocus() {
    this.setData({
      Oactive: 1
    })
  },
  handleOblur() {
    this.setData({
      Oactive: 0
    })
  },
  handleNfocus() {
    this.setData({
      Nactive: 1
    })
  },
  handleNblur() {
    this.setData({
      Nactive: 0
    })
  },
  handleSfocus() {
    this.setData({
      Sactive: 1
    })
  },
  handleSblur() {
    this.setData({
      Sactive: 0
    })
  }
})