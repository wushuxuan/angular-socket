"use strict";

const channelController = require("../controllers/channel-controller");
const fs = require("fs");
const path = require("path");
let util = require("../util/util.js");
let upload = util.upload.single("file");

module.exports = (app) => {
  //获取全部channel
  app.route("/channels").get(channelController.list);
  //channel上传聊天图片
  app.route("/channel/upload").post(upload, channelController.upload);
  //创建新的channel
  app.route("/channel/save").post(channelController.save);
  //单个channel操作
  app
    .route("/channel/:id")
    .get(channelController.channel) //获取某个channel详情
    .put(channelController.update) //更新某个channel详情
    .delete(channelController.delete); //删除某个channel
};
