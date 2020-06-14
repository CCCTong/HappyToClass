// miniprogram/pages/myMainPage/modifyInfomation/modifyInfomation.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentName: "" ,
    studentNum: "",
    studentBirthday: "",
    studentSex: "",
    phone: "",
    email: ""
  },
  setEmail: function(e){
    this.setData({
      email: e.detail
    })
  },
  setPhoneNumber: function(e){
    this.setData({
      phone: e.detail
    })
  },
  setBirthday: function(e){
    this.setData({
      studentBirthday: e.detail
    })
  },
  setSex: function(e){
    this.setData({
      studentSex: e.detail
    })
  },
  submit: function(e){
    console.log(this.data)
    wx.cloud.callFunction({
      name: "modfiyStudentInfo",
      data: {
        studentNum: app.globalData.uid,
        email : this.data.email,
        phone : this.data.phone,
        studentBirthday : this.data.studentBirthday,
        studentSex : this.data.studentSex,
      }
    }).then(res=>{
      wx.showModal({
        title: '修改成功',
      })
    })
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

  }
})