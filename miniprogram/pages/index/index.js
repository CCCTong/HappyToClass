//index.js

const db = wx.cloud.database()
const userCollection = db.collection("user")
var app = getApp()

Page({
  data: {
    username: "",
    uid: "",
    password: "",
    identity: "",
    disable: false
  },

  /**
   * 设置姓名，账号，密码，身份
   */
  setName: function (e) {
    this.setData({
      username: e.detail
    })
    app.globalData.username = this.data.username
  },
  setUid: function (e) {
    this.setData({
      uid: e.detail
    })
    app.globalData.uid = this.data.uid

  },
  setPassword: function (e) {
    this.setData({
      password: e.detail
    })
    app.globalData.password = this.data.password
  },
  onChange: function (e) {
    this.setData({
      identity: e.detail
    })
    app.globalData.identity = this.data.identity
  },
  /**
   * 检查信息是否完整
   */
  judge: function (uid, username, password, identity) {
    var flag = false
    if (username == "") {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
      })
      flag = true
    } else if (uid == "") {
      wx.showModal({
        title: '提示',
        content: '请输入账号',
      })
      flag = true
    } else if (password == "") {
      wx.showModal({
        title: '提示',
        content: '请输入密码',
      })
      flag = true
    } else if (identity == "") {
      wx.showModal({
        title: '提示',
        content: '请选择身份',
      })
      flag = true
    }
    return flag
  },
  /**
   * 注册
   */
  handleReg: function () {
    var username = this.data.username
    var uid = this.data.uid
    var password = this.data.password
    var identity = this.data.identity
    var page = this

    console.log(username, password)

    if (page.judge(uid, username, password, identity) == false) {
      userCollection.where({
        uid: uid,
        username: username
      }).count().then(res => {
        console.log(res.total)
        if (res.total != 0) {
          wx.showModal({
            title: '提示',
            content: '用户已存在',
          })
        } else {
          userCollection.add({
            data: {
              uid: uid,
              username: username,
              password: password,
              identity: identity,
              courses: []
            }

          })
          wx.showModal({
            title: '恭喜',
            content: '注册成功'
          })
        }
      })
    }
  },
  /**
   * 登录
   */
  handleLogin: function () {
    var username = this.data.username
    var uid = this.data.uid
    var password = this.data.password
    var identity = this.data.identity
    var page = this
    console.log(username, password)
    if (page.judge(uid, username, password, identity) == false) {
      userCollection.where({
        uid: uid,
        username: username,
        password: password,
        identity: identity
      }).get().then(res => {
        if (res.data.length == 0) {
          wx.showModal({
            title: '提示',
            content: '登录失败',
          })
        } else {
          var user = {
            username: this.data.username,
            uid: this.data.uid
          }
          wx.setStorageSync('user', user)
          console.log(app.globalData.identity, app.globalData.uid, app.globalData.username, app.globalData.password)
          if (identity == "student") {
            wx.redirectTo({
              url: '../stuPage/stuPage',
            })
          }
          if (identity == "teacher") {
            wx.redirectTo({
              url: '../teaPage/teaPage',
            })
          }
          if (identity == "administrator") {
            wx.redirectTo({
              url: '../adminPage/adminPage',
            })
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },

})