// 管理员处理找回密码的申请
// 该界面会列出申请找回密码的所有账号
const db = wx.cloud.database()
const _ = db.command
var find_list = db.collection("FIND_PASSWORD_LIST")
var user_list = db.collection("user")
const stuList = db.collection("STUDENT_LIST")
const teaList = db.collection("TEACHER_LIST")
const adminList = db.collection("ADMIN_LIST")
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    petitionerList: [], // 申请者列表
    userInfo: [], // 申请者的账号信息
  },

  /**
   * 转向该账号的详细界面
   */
  toIDdetail: function(e) {
    console.log(e)
    var num = e.currentTarget.id
    var identity = e.currentTarget.dataset.identity
    var info = {
      num: num,
      identity: identity
    }
    wx.setStorageSync('info', info)
    wx.navigateTo({
      url: '../../myMainPage/MainPage',
    })
  },
  removeData: function(e) {
    var page = this
    var num = e.currentTarget.id
    find_list.where({
      num:num
    }).remove().then(res=>{
      page.onLoad()
      var pages = getCurrentPages(); // 当前页面
      var beforePage = pages[pages.length - 2]; // 前一个页面
      beforePage.onLoad(); // 执行前一个页面的onLoad方法
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 根据申请数据库，加载邮箱信息
    var page = this
    var numList
    var p = await new Promise((resolve,reject)=>{
      find_list.get().then(res => {
        var data = res.data;
        numList = new Array(data.length)
        page.setData({
          petitionerList: data
        })
        for(let i=0; i<data.length; i++) {
          numList[i] = data[i].num
        }
        resolve(res.data)
      })
    })
    p = await new Promise((resolve,reject)=>{
      user_list.where({
        uid:_.in(numList)
      }).get().then(res => {
        page.setData({
          userInfo: res.data
        })
        resolve(res.data)
      })
    })
    console.log(page.data.userInfo)
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