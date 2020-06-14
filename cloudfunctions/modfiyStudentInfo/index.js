// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var db = cloud.database()
var student_list = db.collection("STUDENT_LIST");
var _ = db.command;


exports.main = async (event, context) => {
  var studentNum = event.studentNum;
  var phone = event.phone;
  var email = event.email;
  var studentBirthday = event.studentBirthday;
  var studentSex = event.studentSex;
  student_list.where({
    StudentNum: studentNum
  }).update({
    data:{
      Email : email,
      Phone :  phone,
      StudentBirthday: studentBirthday,
      StudentSex : studentSex,
    }
  })
}