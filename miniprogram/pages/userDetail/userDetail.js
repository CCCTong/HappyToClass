// 未过审课程详细信息界面

var app = getApp();
var db = wx.cloud.database();
var userList = db.collection("user");//用户表
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:[],
    identity: "",
    courseNum: "",
    courseName: "",
    credit: "",
    time: "",
    location: "",
    num: "",
    teacherNum: "",
    teacherName: "",
  },
  
  /**
   * 删除账号
   */
  async removeCourse(e) {
    var page = this
    wx.showModal({
      title: '提示',
      content: '确定要删除该账号吗？',
      success(res) {
        if (res.confirm) { // 管理员点击确认，则进删除账号数据部分
          userList.where({
            uid: page.data.uid
          }).remove().then(res => {

            var flag = res.stats.removed // 是否成功删除
            if (flag) {
              // 删除成功，返回账号管理界面
              page.changeParentData() // 刷新管理账号界面的数据
              wx.navigateBack({
                delta: 1, // 返回上一级页面。
              })
              wx.showModal({
                title: '提示',
                content: '已删除课程'
              })
            }
          })
        }
      }
    })
  },
  //确认修改
  confirmModify:function(){
    var page = this
    var uid = this.data.uid
    var password = this.data.password
    var username = this.data.userName
    var identity = this.data.userIdentity
    wx.showModal({
      title: '提示',
      content: '确定要修改密码吗？',
      success(res) {
        if (res.confirm) { // 管理员点击确认，则进修改账号数据部分        
          userList.where({
            uid: page.data.uid
          }).remove().then(res => {
            userList.add({
              data: {
                userName:username,
                uid: uid,
                password: password,
                userIdentity:identity
              }
            })
            
              // 修改成功，返回账号管理界面
              page.changeParentData() // 刷新管理账号界面的数据
              wx.navigateBack({
                delta: 1, // 返回上一级页面。
              })
            
          })
        }
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    var page = this
    var uid = app.globalData.uid
    // 根据账号，在数据库中检索该用户相关信息
    var p = await new Promise((resolve, reject) => {
      userList.where({
        uid: uid, 
      }).get().then(res => {
        var userData = res.data[0]
        console.log(userData)
        // 保存检索到的信息，便于显示
        page.setData({
          uid:userData.uid,
          userName:userData.userName,
          userIdentity:userData.userIdentity,
          password:userData.password
        })
        resolve(userData)
      })
    })


  },
  changeParentData: function () {
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      beforePage.changeData(); //触发父页面中的方法
    }
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
  //设置密码
  setpassword:function(e){
    this.setData({
      password: e.detail
    })
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