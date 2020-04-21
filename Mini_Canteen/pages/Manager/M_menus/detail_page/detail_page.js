// pages/Manager/M_menus/detail_page/detail_page.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    add_food: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const page = this;
    const openerevent = this.getOpenerEventChannel();
    openerevent.on('acceptDataFromOpenedPage', function(data) {
      const detail = data.item;
      page.data.add_food = data.add_food;
      page.data.detail = data.item;
      console.log(app.globalData.host + detail.url);
      page.setData({
        url: app.globalData.host + '/mmenus/loadpic?' + detail.url,
        foodid: detail.foodid,
        category: detail.category,
        description: detail.description,
        offertime: detail.foffertime,
        name: detail.title,
        price: detail.price,
        add_food: page.data.add_food
      })
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

  ontapimage() {
    const a = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res);
        a.data.tempFilePaths = res.tempFilePaths;
        a.setData({
          url: res.tempFilePaths[0]
        })
      },
    })
  },

  onsubmit(e) {
    const page = this;
    const form = e.detail.value;
    if (this.data.add_food) {
      if (form.number === '' || form.category === '' || form.price === '' ||
        form.description === '' || form.offertime === '' || form.title === '' || !page.data.tempFilePaths) {
        wx.showToast({
          title: '输入信息不完整',
          icon: 'none',
          mask: true,
          duration: 1500
        })
      } else {
        wx.uploadFile({
          url: app.globalData.host + '/mmenus/addmenus',
          filePath: page.data.tempFilePaths[0],
          name: 'menus_images',
          formData: form,
          timeout: 5000,
          success: function(res) {
            if(res.statusCode === 419){
              wx.showToast({
                title: '标号重复,参照菜单列表',
                icon: 'none',
                duration: 1500
              })
            }else if(res.statusCode === 200){
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 1500
              })
              page.setData({
                url: '/asset/images/default.png',
                foodid: '',
                category: '',
                description: '',
                offertime: '',
                name: '',
                price: '',
              })
            }
          }
        })
      }
    }else{

    }
  },

  deletemenus(){
    console.log(this.data.detail);
    const detail = this.data.detail;
    wx.request({
      url: app.globalData.host + '/mmenus/delete',
      method: 'POST',
      data:{
        url: detail.url,
        foodid: detail.foodid
      },
      success: function(res){
        if(res.statusCode === 200){
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500,
            mask: true
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1600)
        }
      }
    })
  },

  handlefocus() {
    this.setData({
      active: 'focus'
    })
  },
  handleCfocus() {
    this.setData({
      Cactive: 'focus'
    })
  },
  handlePfocus() {
    this.setData({
      Pactive: 'focus'
    })
  },
  handleDfocus() {
    this.setData({
      Dactive: 'focus'
    })
  },
  handleOfocus() {
    this.setData({
      Oactive: 'focus'
    })
  },
  handleNfocus() {
    this.setData({
      Nactive: 'focus'
    })
  },
  handleblur() {
    this.setData({
      active: ''
    })
  },
  handleCblur() {
    this.setData({
      Cactive: ''
    })
  },
  handlePblur() {
    this.setData({
      Pactive: ''
    })
  },
  handleDblur() {
    this.setData({
      Dactive: ''
    })
  },
  handleOblur() {
    this.setData({
      Oactive: ''
    })
  },
  handleNblur() {
    this.setData({
      Nactive: ''
    })
  }
})