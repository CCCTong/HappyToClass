// pages/manageID/manageID.js
var app = getApp()
var db = wx.cloud.database()
var userlist = db.collection("user");
const _ = db.command
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: [],
    disable: false
  },
  //搜索显示需要查询的账号
  onSearch(e) {
    console.log(e.detail)
    var identity = this.data.identity
    if(identity == 'uid'){
    userlist.where({
      uid:e.detail
    }).get().then(res=>{
      this.setData({
        user:res.data
      })
    })
  }else{
    userlist.where({
      userName:e.detail
    }).get().then(res=>{
      this.setData({
        user:res.data
      })
    })
  }
  },
  //取消显示所有用户账号
  onCancel() {
    userlist.get().then(res => {
      this.setData({
        user: res.data
      })
    })
  },
  onChange: function (e) {
    console.log(e.detail)
    this.setData({
      identity: e.detail
    })
   
  },
  into_userPage: function (e) {
    console.log(e.currentTarget.dataset.uid)
    app.globalData.uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../userDetail/userDetail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userlist.get().then(res => {
      this.setData({
        user: res.data
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  refresh: function () {
    wx.showLoading({
      title: '请稍等',
    })
    courseCollection.get().then(res => {
      this.setData({
        user: res.data
      })
      console.log(this.data.user)
    })
    wx.hideLoading()
  },
  refreshAbort: function () {
    wx.showToast({
      title: '刷新成功',
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})