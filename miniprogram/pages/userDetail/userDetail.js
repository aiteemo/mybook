//index.js
const app    = getApp();
const db     = wx.cloud.database();
const mybook = db.collection('mybook');
import Dialog from '../../vant/dialog/dialog';
Page({

    data: {
        avatarUrl: '/images/user-unlogin.png',
        userInfo: {},
        requestResult: '',
        auth_show : false,
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
                } else {
                    this.setData({
                        auth_show: true
                    })
                }
            }
        })
    },

    authOnClose:function() {
        this.setData({
            auth_show: false
        });
    }
})