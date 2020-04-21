// component/category/category.js
// 或许你会发现加购时会出错，但是记住每次点击nav都会重新请求，num重新值为0
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cont_list: {
      type: Array,
      value: []
    },
    cate_item: {
      type: Array,
      value: []
    },
    offertime: {
      type: String,
      value: ''
    },
    tapIndex: { //catebar当前的index
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    host: app.globalData.host + '/mmenus/loadpic?',
    horiz_bar: ["分类"], //此处先不做扩展
    cur_horiz: 0, //horiz_bar点击的index

    total_num: 0, //总的份数
    cart_list: [], //购物车清单
    total_money: 0, //总的价格
    status: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //检查添加购物车商品是否有重复,cur_index为当前点击的cont_list的索引
    checkCartSame(cur_index) {
      var a = this.data
      var foodid = a.cont_list[cur_index].foodid
      var cart_list = this.data.cart_list;
      for (var i = 0; i < cart_list.length; i++) {
        if (foodid === cart_list[i].foodid && a.offertime === cart_list[i].offertime) {
          return i
        }
      }
    },

    //添加购物车
    addCart(cur_index) {
      let a = this.data
      let cart_index = this.checkCartSame(cur_index);
      if (cart_index === undefined) {
        a.cart_list[a.cart_list.length] = {
          foodid: a.cont_list[cur_index].foodid,
          url: a.cont_list[cur_index].url,
          title: a.cont_list[cur_index].title,
          price: a.cont_list[cur_index].price, //商品总价格
          num: a.cont_list[cur_index].num, //商品份数
          offertime: a.offertime
        }
      } else {
        a.cart_list[cart_index].num += 1
      }
    },
    //从购物车中减去
    delCart(cur_index) {
      let a = this.data
      var cart_list = this.data.cart_list;
      var cont_list = this.data.cont_list;
      console.log(cart_list);
      for (let i = 0; i < cart_list.length; i++) {
        if (cart_list[i].foodid === cont_list[cur_index].foodid && cart_list[i].offertime === a.offertime) {
          cart_list[i].num === 1 ? cart_list.splice(i, 1) : cart_list[i].num--;
        }
      }
    },
    //horiz_bar点击事件
    onTapItem(e) {
      // console.log(e);
      this.data.cur_horiz = e.currentTarget.dataset.index;
      this.setData({
        cur_horiz: this.data.cur_horiz
      })
    },
    //菜单种类栏点击事件
    onTapCateItem(e) {
      var index = e.currentTarget.dataset.index;
      this.data.tapIndex = index;
      this.data.currentitem = this.data.cate_item[index];
      console.log(this.data.currentitem);
      this.setData({
        tapIndex: this.data.tapIndex
      })
      wx.request({
        url: app.globalData.host+'/category/catebar',
        data:{
          offertime: this.data.offertime,
          curcate: this.data.currentitem
        },
        method:'POST',
        success: (res)=>{
          console.log(res.data)
          this.data.cont_list = res.data.cont_list;
          this.setData({
            cont_list: this.data.cont_list
          })
        }
      })
    },
    //添加菜的点击事件
    onTapAdd(e) {
      let a = this.data;
      a.offertime = this.properties.offertime;
      let index = e.currentTarget.dataset.index;
      a.cont_list[index].num++;
      this.addCart(index);
      a.total_num++;
      a.total_money += a.cont_list[index].price;
      this.setData({
        [`cont_list[${index}].num`]: a.cont_list[index].num,
      });
      console.log(a.cart_list)
    },
    //减少菜的点击事件
    onTapSub(e) {
      console.log(e);
      let a = this.data;
      a.offertime = this.properties.offertime;
      let index = e.currentTarget.dataset.index;
      a.cont_list[index].num--;
      console.log(a.cont_list[index].num);
      this.setData({
        [`cont_list[${index}].num`]: a.cont_list[index].num
      })
      a.total_num--;
      a.total_money -= a.cont_list[index].price;
      this.delCart(index);
      console.log(a.cart_list);
    },
    //监听手指触摸菜单栏，btn消失
    onTouchStart() {
      this.animation.translateX(45).opacity(0.5).step();
      this.setData({
        // status: 1
        animation: this.animation.export()
      })
      // this.animation.option.transition.delay = 3000;
      clearTimeout(this.data.timer);
      this.data.timer = setTimeout(
        () =>{
          this.animation.translateX(0).opacity(1).step();
          this.setData({
            animation: this.animation.export()
          })
        },2000)
    },
    // //监听手指离开，btn出现
    // onTouchEnd() {
    //   clearTimeout(this.data.timer;
    //   // if (timer === -1) {
    //     this.animation.translateX(0).opacity(1).step();
    //     this.data.timer = setTimeout(() => {
    //       this.setData({
    //         // status: 0
    //         animation: this.animation.export()
    //       });
    //       this.animation.option.transition.delay = 0;
    //     //   this.data.timer = -1
    //     }, 2000)
    //   // }
    // },
    //点击购物车按钮
    onTapcart_btn(e){
      const a = this.data;
      wx.navigateTo({
        url: "/pages/Customer/cart/cart",
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据,没有则不执行
          acceptDataFromOpenedPage: function (data) {
            console.log(data);
            a.cart_list = data.cart_list;
            a.total_money = data.total_money;
            a.total_num = data.total_num;
          },
          paidOK: function(data){
            a.cart_list = data.cart_list;
            a.total_money = data.total_money;
            a.total_num = data.total_num;
          }
        },
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据,传递的数据是数组时，opener可以自动监听到数组变化，整数不行
          res.eventChannel.emit('acceptDataFromOpenerPage', {
              total_num: a.total_num, //总的份数
              cart_list: a.cart_list, //购物车清单
              total_money: a.total_money //总的价格
          })
        }
      });
      for(let i = 0; i < a.cont_list.length; i++){
        a.cont_list[i].num = 0;
      }
      this.setData({
        cont_list: a.cont_list
      })
    }
  },
  lifetimes: {
    attached: function () {
      this.animation = wx.createAnimation();
    }
  }
})