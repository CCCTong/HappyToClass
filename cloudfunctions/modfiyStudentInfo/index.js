// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var db = cloud.database()
var student_list = db.collection("STUDENT_LIST")
var teahcer_list = db.collection("TEACHER_LIST")
var admin_list = db.collection("ADMIN_LIST")
var user_list = db.collection("user")
var _ = db.command;


exports.main = async (event, context) => {
  var identity = event.identity;
  var num = event.num;
  var phone = event.phone;
  var email = event.email;
  var birthday = event.birthday;
  var sex = event.sex;
  user_list.where({
    uid:num
  }).update({
    data:{
      email: email
    }
  })
  if(identity == 'student') {
    student_list.where({
      StudentNum: num
    }).update({
      data:{
        Email : email,
        Phone :  phone,
        StudentBirthday: birthday,
        StudentSex : sex,
      }
    })
  }
  else if(identity == 'teacher') {
    teahcer_list.where({
      TeacherNum: num
    }).update({
      data:{
        Email : email,
        Phone :  phone,
        TeacherBirthday: birthday,
        TeacherSex : sex,
      }
    })
  }
  else {
    admin_list.where({
      AdminNum: num
    }).update({
      data:{
        Email : email,
        Phone :  phone,
        AdminBirthday: birthday,
        AdminSex : sex,
      }
    })
  }
}