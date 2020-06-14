// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const student_course = db.collection("STUDENT_COURSE")
  return await student_course.where({
      StudentNum: event.studentNum,
  }).update({
    data:{
      CourseName: _.push(event.courseName),
      CourseNum: _.push(event.courseNum)
    }
  })
}