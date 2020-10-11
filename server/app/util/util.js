//放一些公用方法的文件

//引入文件上传模块
const multer = require("multer");

//文件上传方法
let storage = multer.diskStorage({
  //设置上传后文件路径，uploads文件夹会自动创建。
  destination: function (req, file, cb) {
    //和ueditor的图片上传路径分开一下
    cb(null, "./public/img/user");
  },
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    let fileFormat = file.originalname.split(".");
    //命名：采用了原本名字+时间的形式，可以有效避免重名文件的问题
    cb(
      null,
      fileFormat[0] + "-" + Date.now() + "." + fileFormat[fileFormat.length - 1]
    );
  },
});

//添加配置文件到multer对象。
let upload = multer({
  storage: storage,
});

module.exports = {
  upload,
};
