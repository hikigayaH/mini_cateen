// pages/M_menus/M_menus.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_list: [],
    pagenum: 1,
    first: false,
    total_page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('onload');
    this.data.first = true;
    const page = this;
    wx.showLoading({
      title: '加载中.....',
    })
    wx.request({
      url: app.globalData.host + '/mmember',
      method: 'POST',
      data: {
        pagenum: this.data.pagenum
      },
      success: (res) => {
        console.log(res.data);
        this.data.member_list = res.data.member_list;
        this.data.total_page = res.data.total_page;
        wx.hideLoading();
        console.log(page.data.member_list);
        this.setData({
          member_list: this.data.member_list,
          pagenum: this.data.pagenum,
          total_page: this.data.total_page
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
    console.log('onshow');
    const page = this;
    wx.showLoading({
      title: '加载中.....',
    })
    wx.request({
      url: app.globalData.host + '/mmember',
      method: 'POST',
      data: {
        pagenum: this.data.pagenum
      },
      success: (res) => {
        console.log(res.data);
        this.data.member_list = res.data.member_list;
        this.data.total_page = res.data.total_page;
        wx.hideLoading();
        console.log(page.data.member_list);
        this.setData({
          member_list: this.data.member_list,
          pagenum: this.data.pagenum,
          total_page: this.data.total_page
        })
      }
    })
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

  lastpage() {

  },

  nextpage() {
    const page = this;
    if (this.data.pagenum < this.data.total_page) {
      this.data.pagenum++;
      wx.showLoading({
        title: '加载中.....',
      })
      wx.request({
        url: app.globalData.host + '/mmember',
        method: 'POST',
        data: {
          pagenum: this.data.pagenum
        },
        success: (res) => {
          // this.data.pagenum = res.data.page;
          this.data.member_list = res.data.member_list;
          wx.hideLoading();
          console.log(this.data.member_list);
          this.setData({
            member_list: this.data.member_list,
            pagenum: this.data.pagenum
          })
        }
      })
    }
  },

  lastpage() {
    const page = this;
    if (this.data.pagenum > 1) {
      this.data.pagenum--;
      wx.showLoading({
        title: '加载中.....',
      })
      wx.request({
        url: app.globalData.host + '/mmember',
        method: 'POST',
        data: {
          pagenum: this.data.pagenum
        },
        success: (res) => {
          // this.data.pagenum = res.data.page;
          this.data.member_list = res.data.member_list;
          wx.hideLoading();
          console.log(this.data.member_list);
          this.setData({
            member_list: this.data.member_list,
            pagenum: this.data.pagenum
          })
        }
      })
    }
  },

  changefood(e) {
    let item = e.currentTarget.dataset.item;
    console.log(item);
    wx.navigateTo({
      url: '/pages/Manager/M_member/member_detail/member_detail',
      success: (res) => {
        res.eventChannel.emit('acceptDataFromOpenedPage', {item})
      }
    })
  }
})