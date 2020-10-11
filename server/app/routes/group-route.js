"use strict";

const groupController = require("../controllers/group-controller");
const fs = require("fs");
const path = require("path");
let util = require("../util/util.js");
let upload = util.upload.single("file");

module.exports = (app) => {
  //获取全部group
  app.route("/groups").get(groupController.list);
  //group上传封面图片
  app.route("/group/upload").post(upload, groupController.upload);
  //创建新的group
  app.route("/group/save").post(groupController.save);
  //单个group操作
  app
    .route("/groups/:id")
    .get(groupController.get) //获取某个group详情
    .put(groupController.update) //更新某个group详情
    .delete(groupController.delete); //删除某个group
};
