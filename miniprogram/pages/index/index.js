//index.js
const app    = getApp();
const db     = wx.cloud.database();
const mybook = db.collection('mybook');
import Dialog from '../../vant/dialog/dialog';
Page({

  data: {
      avatarUrl: './user-unlogin.png',
      userInfo: {},
      logged: false,
      takeSession: false,
      requestResult: '',
      myBookList : [],
      nowPage : 1,
      pageLimit : 6,
      is_loading : false,
  },

  onLoad: function() {

      var _this = this;

      if (!wx.cloud) {
          wx.redirectTo({
            url: '../chooseLib/chooseLib',
          })
          return
      }

      // 获取用户信息
      wx.getSetting({
          success: res => {
              if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                      success: res => {
                          this.setData({
                              avatarUrl: res.userInfo.avatarUrl,
                              userInfo: res.userInfo
                          })
                      }
                  })
              }
          }
      })

      // 获取图书列表
      db.collection('mybook').field({
          title: true,
          tags: true,
          price: true,
          author: true,
          images: true
      }).limit(this.data.pageLimit).orderBy('_id','desc').get({

          success:res=> {
              var nowPage    = 0;
              var myBookList = [];
              // res.data 包含该记录的数据
              if(res.data) myBookList = res.data
              this.setData({
                  is_loading : true,
                  myBookList : myBookList,
                  nowPage    : nowPage,
              });
          }
      });
  },

    // 下拉刷新
    onPullDownRefresh:function() {
        // 刷新图书列表
        this.refashBookList();
    },
    onShow:function() {
        // 刷新图书列表
        this.refashBookList();
    },

    refashBookList:function() {
        // 刷新图书列表
        db.collection('mybook').field({
            title: true,
            tags: true,
            price: true,
            author: true,
            images: true
        }).limit(this.data.pageLimit).orderBy('_id','desc').get({
            success:res=> {
                var nowPage    = 0;
                var myBookList = [];
                // res.data 包含该记录的数据
                if(res.data) myBookList = res.data
                this.setData({
                    is_loading : true,
                    myBookList : myBookList,
                    nowPage    : nowPage,
                });
            }
        });
        wx.stopPullDownRefresh()
    },

  onReachBottom:function(){

      const skip = (this.data.nowPage+1) * this.data.pageLimit;

      // 加载图书列表
      db.collection('mybook').skip(skip).limit(this.data.pageLimit).orderBy('_id','desc').get({
              success:res=> {
                  // res.data 包含该记录的数据
                  if(res.data.length > 0) {
                      const tmp_data    = this.data.myBookList.concat(res.data)
                      this.data.nowPage = this.data.nowPage+1;
                      this.setData({
                          myBookList : tmp_data
                      })
                  } else {
                      wx.showToast({
                          'title':'已经暖到底啦！',
                          'icon':'success'
                      })
                  }
              }
      });
  },
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

    // 删除图书
    deleteBook:function(event) {

        var myBookList  =   this.data.myBookList;
        var _this       =   this;

        var book_id     =   event.currentTarget.dataset.id;
        var book_index  =   event.currentTarget.dataset.index;

        Dialog.confirm({
            title: '移除图书',
            message: '您确认要移除这本图书吗？'
        }).then(() => {
            // on confirm
            console.log(book_id)
            console.log(book_index)
            db.collection('mybook').doc(book_id).remove()
                .then(function (res) {
                    if(res.stats.removed) {
                        myBookList.splice(book_index,1)
                        _this.setData({
                            myBookList : myBookList
                        });
                        wx.showToast({
                            'title':'移除成功',
                            'icon':'success'
                        })
                    }
                })
                .catch(console.error)
        }).catch(() => {
            // on cancel
            console.log("cancel")
        });
    }
})
