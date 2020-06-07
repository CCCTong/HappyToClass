// miniprogram/pages/createCourse/createCourse.js

const db = wx.cloud.database()
const courseCollection = db.collection("course")
var user = (wx.getStorageSync('user')||[])

Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    coursename:"",
    cid:"",
    username:user.username,
    uid:user.uid,
    category:"",
    credit:"",
    precourse:"",
    preid:"",
    time:"",
    location:"",
    Num:"",
    categoryList: ['选修课', '必修课'],
    show: false
  },
  
 
  /*** 
   * 设置课程名，课程号，种类，学分，，先修课程，人数
   */
  setcourseName: function (e) {
    this.setData({ coursename: e.detail })
   
  },
  setCid: function (e) {
    this.setData({ cid: e.detail })
    
  },
  setCredit: function (e) {
    this.setData({ credit: e.detail })
    
  },
  setCategory: function (e) {
    this.setData({category: e.detail})

  },
  setPrecourse: function (e) {
    this.setData({precourse: e.detail})
    
  },
  setPrecourse: function (e) {
    this.setData({preid: e.detail})
    
  },
  setPrecourse: function (e) {
    this.setData({time: e.detail})
    
  },
  setPrecourse: function (e) {
    this.setData({location: e.detail})
    
  },
  setNum: function (e) {
    this.setData({Num: e.detail})
    
  },

  /**
     * 检查信息是否完整
     */
    judge: function ( coursename, cid,credit,category,precourse,preid,Num) {
      var flag = false
      if (coursename == "") {
        wx.showModal({
          title: '提示',
          content: '请输入课程名',
        })
        flag = true
      }
      else if (credit == "") {
        wx.showModal({
          title: '提示',
          content: '请输入课程学分',
        })
        flag = true
      }
      else if (category == "") {
        wx.showModal({
          title: '提示',
          content: '请输入课程类型',
        })
        flag = true
      }
      else if (Num == "") {
        wx.showModal({
          title: '提示',
          content: '请输入人数上限',
        })
        flag = true
      }
      return flag
    },

    /**
     * 创建课表
     */
    handleReg: function () {
      var coursename = this.data.coursename
      var cid = this.data.cid
      var credit = this.data.credit
      var category = this.data.category
      var precourse = this.data.precourse
      var preid = this.data.preid
      var time = this.data.time
      var location = this.location
      var Num = this.data.Num
      var page = this
      
      console.log(coursename, cid)

      if (page.judge(coursename, cid,credit,category,precourse,Num) == false) {
        courseCollection.where({
          cid: cid,
          coursename:coursename
        }).count().then(res => {
          console.log(res.total)
          if (res.total != 0) {
            wx.showModal({
              title: '提示',
              content: '课程已存在',
            })
          }
          else {
            courseCollection.add({
              data: {
                cid: cid,
                coursename: coursename,
                teachername: user.username,
                teacherid: user.uid,
                categor:category,
                credit:credit,
                precourse:precourse,
                preid:preid,
                time:time,
                location:location,
                Num:Num
              }
              
            })
            wx.showModal({
              title: '恭喜',
              content: '创建成功'
          })
          }
        })
      }
    },
})