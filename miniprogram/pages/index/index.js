//index.js
/**
 * 登录界面，登录功能单用一个数据库，账号为学号、工号，
 * 记录：账号、密码
 */

const db = wx.cloud.database()
const stuList = db.collection("STUDENT_LIST")
const teaList = db.collection("TEACHER_LIST")
const adminList = db.collection("ADMIN_LIST")
var userList = db.collection("user");
var app = getApp()

var dbModule = require('../../my_modules/dataBaseManager.js')
var dbClass = new dbModule.DataBaseManager()

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
      }
      else if (uid == "") {
        wx.showModal({
          title: '提示',
          content: '请输入账号',
        })
        flag = true
      }
      else if (password == "") {
        wx.showModal({
          title: '提示',
          content: '请输入密码',
        })
        flag = true
      }
      else if (identity == "") {
        wx.showModal({
          title: '提示',
          content: '请选择身份',
        })
        flag = true
      }
      return flag
    },
    /**
     * 注册,向用户数据库中上传用户的账号、密码
     */
    handleReg: function () {
      var uid = this.data.uid
      var password = this.data.password
      var page = this
      var username = this.data.username
      var identity = this.data.identity
      console.log(username, password)
      
      // 检测信息是否填写完整
      if (page.judge(uid, username, password, identity) == false) {
        // 信息填写完整
        userList.where({
          uid: uid,
        }).count().then(res => {
          console.log(res.total)
          if (res.total != 0) {
            wx.showModal({
              title: '提示',
              content: '用户已存在',
            })
          }
          else {
            userList.add({
              data: {
                uid: uid,
                password: password,
              }
            })
            // 向学生or教师or管理员数据库中添加该用户的数据
            if(identity == "teacher"){
              dbClass.addTeacherData(uid)
            }
            else if(identity == "student"){
              dbClass.addStudentData(uid)
            }
            else{
              dbClass.addAdminData(uid)
            }
            wx.showModal({
              title: '恭喜',
              content: '注册成功'
          })
          }
        })
      }
    },

  /**
   * 登录，跳转到相应的个人界面
   */
  handleLogin: function () {
    var username = this.data.username
    var uid = this.data.uid
    var password = this.data.password
    var identity = this.data.identity
    var page = this
    console.log(username, password)
    if (page.judge(uid, username, password, identity) == false) {
      // 检查该用户是否在数据库中
      userList.where({
        uid: uid,
        password: password,
      }).get().then(res => {
        if (res.data.length == 0) {
          wx.showModal({
            title: '提示',
            content: '登录失败',
          })
        } else {
          // 保存用户相关信息，用做页面跳转之后使用
          var user = {
            teacherName: this.data.username,
            teacherNum: this.data.uid
          }
          wx.setStorageSync('user', user)
          console.log(app.globalData.identity, app.globalData.uid, app.globalData.username, app.globalData.password)
          console.log(page.data)
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