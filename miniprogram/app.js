//app.js
App({
  onLaunch: function () {
    if (wx.cloud) {
      wx.cloud.init({
        env: "my-object-xttai",
        traceUser: true
      })
      wx.cloud.callFunction({
        name: "getOpenId"
      }).then(res => {
        this.globalData.openid = res.result.openid
      })
    }
  },
  globalData: {
    username: "SE",
    uid: "1",
    password: "",
    identity: "",
    courses: [],
    courseName: "",
    openid: "",
    courseNum:""
  }
})