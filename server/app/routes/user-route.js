"use strict";

const userController = require("../controllers/user-controller");
const fs = require("fs");
const path = require("path");
let util = require("../util/util.js");
let upload = util.upload.single("file");

module.exports = (app) => {
  //获取全部user
  app.route("/users").get(userController.list);
  //user上传头像图片
  app.route("/user/upload").post(upload, userController.upload);
  //创建新的user
  app.route("/user/register").post(userController.save);
  //登录
  app.route("/user/login").post(userController.login);
  //单个user操作
  app
    .route("/users/:id")
    .get(userController.get) //获取某个user详情
    .put(userController.update) //更新某个user详情
    .delete(userController.delete); //删除某个user
};
