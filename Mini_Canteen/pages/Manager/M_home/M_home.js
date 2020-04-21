// pages/M_home/M_home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      {
        src: "/asset/icon/order_active.png",
        title: "订单",
        url: "/pages/Manager/M_order/M_order"
      },
      {
        src: "/asset/icon/profile_active.png",
        title: "我的",
        url: "/pages/Manager/M_profile/M_profile"
      },
      {
        src: "/asset/icon/menus.png",
        title: "菜单",
        url: "/pages/Manager/M_menus/M_menus"
      },
      {
        src: "/asset/icon/member.png",
        title: "员工",
        url: "/pages/Manager/M_member/M_member"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('token')) {
      wx.request({
        url: app.globalData.host + '/mhome',
        method: 'POST',
        header: {
          Authorization: 'Bearer ' + wx.getStorageSync('token')
        },
        success: (res) => {
          console.log(res.data)
          this.data.userdata = res.data.user
        }
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000,
        success: () => {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      })
    }
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

  onclickButton(e){
    console.log(e)
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
      success: (res)=>{
        console.log(this.data.userdata);
        res.eventChannel.emit('sendmanagerid', { managerid: this.data.userdata.managerid})
      }
    })
  },

  onexit(){
    wx.clearStorageSync();
    wx.redirectTo({
      url: '/pages/login/login'
    })
  }
})