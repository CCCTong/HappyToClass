// 该函数为教师删除自己创建的课程
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  e = event
  courseNum = e.courseNum
  console.log(courseNum)
  console.log('kkkkkkkkkkkkk')
  // try {
  //   return await db.collection('COURSE_LIST').where({
  //     CourseNum: courseNum
  //   }).remove()
  // } catch(e) {
  //   console.error(e)
  // }
}