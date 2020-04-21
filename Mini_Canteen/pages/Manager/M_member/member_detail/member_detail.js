// pages/Manager/M_member/member_detail/member_detail.js
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
  onLoad: function (options) {
    const page = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenedPage',function(data){
      console.log(data.item);
      let item = data.item;
      page.data.userid = data.item.userid;
      page.setData({
        userid: item.userid,
        uname: item.uname,
        ubalance: item.ubalance,
        ugender: page.returngender(item.ugender)
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

  changebalance(e){
    console.log(e.detail.value);
    let ubalance = e.detail.value.ubalance;
    wx.request({
      url: app.globalData.host + '/mmember/changebalance',
      method: 'POST',
      data: {
        userid: this.data.userid,
        ubalance: e.detail.value.ubalance
      },
      success: function(res){
        if(res.statusCode === 200){
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000,
            mask: true
          })
        }
      }
    })
  },

  deleteuser(){
    const page = this;
    wx.request({
      url: app.globalData.host + '/mmember/deleteuser',
      method: 'POST',
      data: {
        userid: this.data.userid,
      },
      success: function (res) {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000,
            mask: true
          })
          page.data.timer = setTimeout(
            function(){
              wx.navigateBack({
                delta: 1
              })
            },2100)}
      }
    })
  },

  returngender(gender){
    if(gender === 1){
      return '男'
    }else if(gender === 0){
      return '女'
    }else{
      return gender;
    }
  },

  handleBfocus() {
    this.setData({
      Bactive: 1
    })
  },

  handleBblur() {
    this.setData({
      Bactive: 0
    })
  }
})