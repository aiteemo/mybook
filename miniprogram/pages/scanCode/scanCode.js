const db = wx.cloud.database()
const mybook = db.collection('mybook')
// pages/scanCode/scanCode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isFirstShow : 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

    onShow:function() {
        if(this.data.isFirstShow==1) {
            this.data.isFirstShow=2
          // 刷新图书列表
          this.scanCode();
        }
    },

  /**
   * 扫码添加书籍
   */
  scanCode: function(event) {

    wx.scanCode({

      onlyFromCamera:true,
      scanType: ['barCode'],
      success:res=> {
        
        wx.showLoading({
          'title': '正在添加'
        })
        // 获取图书详情
        wx.cloud.callFunction({
          // 要调用的云函数名称
          name: 'bookinfo',
          // 传递给云函数的参数
          data: {
            isbn:res.result
          },
          success: res => {
              var bookinfo = JSON.parse(res.result)
              //console.log(bookinfo);return;
              if(!bookinfo || !bookinfo.id) {
                  wx.hideLoading();
                  wx.showToast({
                      'title':'哎呀我不认识噢',
                      'icon':'none'
                  })
                  return;
              }
              bookinfo.add_time = db.serverDate();
            
            //插入图书
            db.collection('mybook').add({
              // data 字段表示需新增的 JSON 数据
              data: bookinfo,
              success: function (res) {
                wx.hideLoading()
                if (res._id) {
                  wx.showToast({
                    'title':'添加成功',
                    'icon':'success'
                  })
                }
              }
            })
            // output: res.result === 3
          },
          fail: err => {
            // handle error
            console.error(err)
          }
        })
      },
      fail:err => {
        console.log(err)
      }

    })
  },
})