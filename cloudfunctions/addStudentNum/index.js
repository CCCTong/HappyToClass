// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const course_student = db.collection("COURSE_STUDENT")
  return await course_student.where({
    CourseName: event.courseName,
  }).update({
    data:{
      StudentName: _.push(event.studentName),
      StudentNum: _.push(event.studentNum)
    }
  })
}