// pages/home/home.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_content: ['早餐', '中餐', '晚餐'],
    recomPage: {
      type: Array,
      values: [{}]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const a = this.data;
    wx.request({
      url: app.globalData.host+'/category/offertime',
      data:{
        offertime: this.data.nav_content[0]
      },
      method: 'POST',
      success: (res)=>{
        console.log(res.data);
        a.cateData = res.data
        this.setData({
          nav_content: a.nav_content,
          cont_list: a.cateData.cont_list,
          cate_item: a.cateData.cate_item,
          offertime: this.data.nav_content[0]
        })
      }
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

  // onTapsearch(){
  //   wx.navigateTo({
  //     url: '/pages/search/search',
  //   })
  // }

  //获取nav的信息，传递给body
  onTapnav(e){
    console.log(e.detail.title);
    const use_time = e.detail.title;
    const a = this.data;
    wx.request({
      url: app.globalData.host + '/category/offertime ',
      data: {
        offertime: use_time
      },
      method: 'POST',
      success: (res) => {
        console.log(res.data);
        a.cateData = res.data
        this.setData({
          // nav_content: a.nav_content,
          cont_list: a.cateData.cont_list,
          cate_item: a.cateData.cate_item,
          offertime: use_time,
          tapIndex: 0
        })
      }
    })
  }
})