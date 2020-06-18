// 用户忘记密码之后，跳转到本页面找回密码
const db = wx.cloud.database()
const find_list = db.collection("FIND_PASSWORD_LIST")
const user_list = db.collection('user')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: "", // 账号信息
    message: "", // 传递给管理员的信息
  },

  setNum: function (e) {
    this.setData({
      num: e.detail
    })
  },
  setMessage: function (e) {
    this.setData({
      message: e.detail
    })
  },
  /**
   * 检查邮箱格式是否正确
   */
  checkEmail: function (email) {
    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    //调用正则验证test()函数
    return email != "" & reg.test(email)
  },
  /**
   * 发送邮件
   */
  sendEmail: function (e) {
    var page = this
    if (!page.judge(page.data.num)){
      wx.showModal({
        title: '提示',
        content: '请输入账号',
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '我们将发送邮件到该账户的邮箱，点击确认发送邮件',
      success(res) {
        if (res.confirm) {
          console.log(page.data)
          user_list.where({
            uid: page.data.num
          }).get().then(res => {
            var email = res.data[0].email
            var password = res.data[0].password
            if(!page.checkEmail(email)){
              wx.showModal({
                title: '失败',
                content: '发送邮件失败，请尝试其他方法找回密码',
              })
            }else{
              // 调用云函数，发送邮箱
              wx.cloud.callFunction({
                name: "sendEmail",
                data: {
                  email: email,
                  message: '您的密码为'+password,
                }
              })
              wx.showModal({
                title: '提示',
                content: '已发送邮箱，若五分钟内未收到相关邮箱，请使用其他方法找回密码',
              })
            }
          })
        }
      }
    })
  },
  /**
   * 提交信息，写入数据库
   */
  submit: function () {
    var num = this.data.num
    var page = this
    if (page.judge(num)) {
      user_list.where({
        uid: num
      }).count().then(res => {
        if (res.total == 0) {
          wx.showModal({
            title: '提示',
            content: '没有该账号的信息',
          })
        } else {
          find_list.where({
            num: num,
          }).count().then(res => {
            if (res.total > 0) {
              wx.showModal({
                title: '重复申请',
                content: '已申请找回密码，管理员正在处理，请稍侯',
              })
            } else {
              find_list.add({
                data: {
                  num: num,
                  message: page.data.message
                }
              }).then(res => {
                wx.showModal({
                  title: '申请成功',
                  content: '已收到申请，管理员将通过邮箱通知您，请注意查收邮件'
                })
              })
            }
          })
        }
      })
    }
  },
  /**
   * 检查信息是否完整
   */
  judge: function (num) {
    var flag = true
    if (num == "") {
      wx.showModal({
        title: '提示',
        content: '请输入账号',
      })
      flag = false
    }
    return flag
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