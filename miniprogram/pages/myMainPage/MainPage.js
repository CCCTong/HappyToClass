// miniprogram/pages/myMainPage/MainPage.js
var app = getApp();   
const db = wx.cloud.database();
const student_list = db.collection("STUDENT_LIST")
const teahcer_list = db.collection("TEACHER_LIST")
const admin_list = db.collection("ADMIN_LIST")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "" ,      // 用户姓名
    num: "",        // 用户账号
    birthday: "",   // 用户生日
    sex: "",        // 用户性别
    phone: "",      // 用户电话
    email: ""       // 用户邮箱
  },
  /**
   * 点击修改信息按钮，进入信息修改页面
   */
  modifyInfo: function() {
    wx.navigateTo({
      url: 'modifyInfomation/modifyInfomation',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options){
    var num = app.globalData.uid
    // 加载用户身份，用于判断修改哪个数据库
    var identity = app.globalData.identity
    
    // 学生设置个人信息，向数据库中检索原来的个人信息
    if(identity == 'student') {
      student_list.where({
        StudentNum: num
      }).get().then(res => {
        this.setData({
          name: res.data[0].StudentName,
          num: res.data[0].StudentNum,
          birthday: res.data[0].StudentBirthday,
          sex: res.data[0].StudentSex,
          phone: res.data[0].Phone,
          email: res.data[0].Email
        })
      })
    }
    // 教师设置个人信息
    else if (identity == 'teacher') {
      teahcer_list.where({
        TeacherNum: num
      }).get().then(res => {
        this.setData({
          name: res.data[0].TeacherName,
          num: res.data[0].TeacherNum,
          birthday: res.data[0].TeacherBirthday,
          sex: res.data[0].TeacherSex,
          phone: res.data[0].Phone,
          email: res.data[0].Email
        })
      })
    }
    // 管理员设置个人信息
    else {
      admin_list.where({
        AdminNum: num
      }).get().then(res => {
        this.setData({
          name: res.data[0].AdminName,
          num: res.data[0].AdminNum,
          birthday: res.data[0].AdminBirthday,
          sex: res.data[0].AdminSex,
          phone: res.data[0].Phone,
          email: res.data[0].Email
        })
      })
    } 
  },
  // 从子页面返回的时候重新加载数据
  changeData:function(){
    this.onLoad();
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