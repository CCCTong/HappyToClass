// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const course_list = db.collection("COURSE_LIST")
  return await course_list.where({
      CourseName: event.courseName
  }).update({
    data:{
      Num:_.inc(1)
    }
  })
}