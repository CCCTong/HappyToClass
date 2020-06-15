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
        //如果输入的姓名是空白的
        // 给出提示窗口，提示输入姓名
        wx.showModal({
          title: '提示',
          content: '请输入姓名',
        })
        flag = true
      }
      else if (uid == "") {
        //如果输入的账号是空白的
        // 给出提示窗口，提示输入账号
        wx.showModal({
          title: '提示',
          content: '请输入账号',
        })
        flag = true
      }
      else if (password == "") {
        //如果输入的密码是空白的
        // 给出提示窗口，提示输入密码
        wx.showModal({
          title: '提示',
          content: '请输入密码',
        })
        flag = true
      }
      else if (identity == "") {
        //如果输入的身份是空白的
        // 给出提示窗口，提示输入身份
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
    checkUserName(username){
      for(var i=0; i<username.length; i++){
        // 标记变量，标记检查是否合格
        var tag = 0;
        // 检查名称中是否有字符
        if ('a'<=username[i] && username[i] <= 'z'){
          tag = 1;
        }
        // 检查名称中是否有带大写字母
        if ('A'<=username[i] && username[i] <= 'Z'){
          tag = 1;
        }
        // 检查名称中是否有数字
        if ('0'<=username[i] && username[i] <= '9'){
          tag = 1;
        }
        if (tag === 1){
          // 不合格情况下展示弹窗提示
          wx.showModal({
            title: '提示',
            content: '请输入真实姓名',
          })
          return false;
        }
      }
      // 全部合法返回true，否则在循环中阶段
      return true;
    },
    checkUserNum(uid){
      for(var i=0; i<uid.length; i++){
        if (uid[i] < '0' || uid[i] > '9'){
          wx.showModal({
            title: '提示',
            content: '请输入合法的学号',
          })
          return false;
        }
      }
      return true;
    },
    checkPassWord(password){
      if (password.length <= 7){
        wx.showModal({
          title: '提示',
          content: '密码太短',
        })
        return false;
      }
      return true;
    },
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
            return;
          }
          console.log(11111111111111)

          if (!this.checkUserName(username)) return;
          console.log(2222222222222222)

          if (!this.checkUserNum(uid)) return;
          console.log(333333333333);
          if (!this.checkPassWord(password))return;
          userList.add({
            data: {
              userName:username,
              uid: uid,
              password: password,
              userIdentity:identity
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
    console.log(username,uid, password, identity)
    // 检查信息是否正确
    if (page.judge(uid, username, password, identity) == false) {
      // 检查该用户是否在数据库中,以及信息是否匹配
      userList.where({
        uid: uid,
        password: password,
        userIdentity:identity
      }).get().then(res => {
        // 如果返回不存在这样的人的信息
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
          // 根据用户身份，跳转到相应的界面
          if (identity == "student") {
            wx.redirectTo({
              url: '../studentPage/stuPage',
            })
          }
          if (identity == "teacher") {
            wx.redirectTo({
              url: '../teacherPage/teaPage',
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