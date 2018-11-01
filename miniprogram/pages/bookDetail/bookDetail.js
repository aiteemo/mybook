// pages/bookDetail/bookDetail.js
const app    = getApp();
const db     = wx.cloud.database();
const mybook = db.collection('mybook');

Page({
    data:{
        avatarUrl: './user-unlogin.png',
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        bookDetail : {},
        is_loading : false,
        tag_color : ['#f2826a','7232dd']
    },
    onLoad: function(options) {


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
        db.collection('mybook').doc(options.id).field({
            title: true,
            tags: true,
            price: true,
            author: true,
            images: true,
            catalog: true,
            publisher: true,
            pubdate: true,
            isbn13: true,
            author_intro: true,
            summary: true
        }).get({
            success:res=> {
                var nowPage    = 0;
                var bookDetail = [];
                // res.data 包含该记录的数据
                if(res.data) bookDetail = res.data
                this.setData({
                    is_loading : true,
                    bookDetail : bookDetail
                });
            }
        });
    },
})
