const db = wx.cloud.database()
const mybook = db.collection('mybook')
// pages/scanCode/scanCode.js
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

  /**
   * 扫码添加书籍
   */
  scanCode: function(event) {

    wx.scanCode({

      onlyFromCamera:true,
      scanType: ['barCode'],
      success:res=> {
        
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
            
            //插入图书
            db.collection('mybook').add({
              // data 字段表示需新增的 JSON 数据
              data: bookinfo,
              success: function (res) {
                console.log(res)
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
        console.log(res)
      }

    })
  },
})