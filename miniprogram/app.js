//app.js
App({
  onLaunch: function () {
    if(wx.cloud){
      wx.cloud.init({
        env:"xuanke-lkg7q",
        traceUser:true
      })
      wx.cloud.callFunction({
        name:"getOpenId"
      }).then(res=>{
        this.globalData.openid = res.result.openid
      })
    }
  },
  globalData:{
    username: "SE",
    uid:"",
    password:"",
    identity:"",
    courses:[],
    courseName:"",
    openid:""
  }
})