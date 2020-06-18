// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
var db = cloud.database()
var user_list = db.collection("user");
// 云函数入口函数
exports.main = async (event, context) => {
  var num = event.num;
  var password = event.password;
  console.log(password)
  user_list.where({
    uid: num
  }).update({
    data:{
      password:password
    }
  })
}