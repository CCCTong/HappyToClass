// miniprogram/pages/myMainPage/modifyInfomation/modifyInfomation.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    num: "",
    birthday: "",
    sex: "",
    phone: "",
    email: "",
    changeType: "", // 修改类型，修改个人信息or 修改密码
    newPassword: "", // 新密码，写入数据库
    oldPassword: "" // 旧密码
  },
  /**
   * 检查邮箱格式是否正确
   */
  checkEmail: function(email) {
    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    //调用正则验证test()函数
    return email != "" & reg.test(email)
  },
  /** 
   * 设置邮箱、电话、生日、性别、密码
   */
  setEmail: function (e) {
    this.setData({
      email: e.detail
    })
  },
  setPhoneNumber: function (e) {
    this.setData({
      phone: e.detail
    })
  },
  setBirthday: function (e) {
    this.setData({
      birthday: e.detail
    })
  },
  setSex: function (e) {
    this.setData({
      sex: e.detail
    })
  },
  setPassword: function (e) {
    this.setData({
      newPassword: e.detail
    })
  },
  checkPassWord: function(password){
    if (password.length <= 7){
      wx.showModal({
        title: '提示',
        content: '密码太短',
      })
      return false;
    }
    return true;
  },
  /**
   * 上传信息，修改密码
   */
  changePassword: function () {
    var page = this
    var password = page.data.newPassword
    if (!this.checkPassWord(password))return;
    // 调用云函数，修改个人信息
    wx.cloud.callFunction({
      name: "changePassword", // 云函数名称
      data: {
        num: app.globalData.uid,
        password: password
      }
    }).then(res => {
      wx.showModal({
        title: '修改成功',
        success(res) {
          if (res.confirm) {
            app.globalData.password = password
            // 修改成功，返回课程管理界面
            page.changeParentData() // 刷新父界面的数据
            wx.navigateBack({
              delta: 1, // 返回上一级页面。
            })
          }
        }
      })
    })
  },

  // 提交信息，上传数据
  submit: function (e) {
    if(!this.checkEmail(this.data.email)) {
      wx.showModal({
        title: '提示',
        content: '邮箱格式错误，请重新输入',
      })
      return
    }
    var page = this
    console.log(this.data)
    // 调用云函数，修改个人信息
    wx.cloud.callFunction({
      name: "modfiyStudentInfo", // 云函数名称
      data: {
        num: app.globalData.uid,
        email: this.data.email,
        phone: this.data.phone,
        birthday: this.data.birthday,
        sex: this.data.sex,
        identity: app.globalData.identity
      }
    }).then(res => {
      wx.showModal({
        title: '修改成功',
        success(res) {
          if (res.confirm) {
            // 修改成功，返回课程管理界面
            page.changeParentData() // 刷新父界面的数据
            wx.navigateBack({
              delta: 1, // 返回上一级页面。
            })
          }
        }
      })
    })
  },
  /**
   * 页面跳转时，更新父页面数据
   */
  changeParentData: function () {
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      beforePage.changeData(); //触发父页面中的方法
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this
    wx.getStorage({ //获取本地缓存
      key: "user",
      success: function (res) {
        page.setData({
          changeType: res.data.changeType
        })
        console.log(page.data.changeType)
      },
    })
    page.setData({
      num: app.globalData.uid,
      oldPassword: app.globalData.password
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