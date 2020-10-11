"use strict";

const groupService = require("../services/group-service");
//引入工具文件
const fs = require("fs");
const path = require("path");
let util = require("../util/util.js");
let upload = util.upload.single("file");

function resolvePath(dir) {
  return path.resolve("./public", dir);
}

function generateMixed(n) {
  var chars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  var res = "";
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 62);
    res += chars[id];
  }
  return res;
}

exports.upload = (request, res) => {
  console.log("body:");
  console.log(request.body);
  console.log("file:");
  console.log(request.file);
  let des_file = "./public" + "/fileHome/" + request.file.filename;
  if (!fs.existsSync(resolvePath("./fileHome"))) {
    fs.mkdirSync(resolvePath("fileHome"));
  }
  fs.readFile(request.file.path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      let response = {};
      if (err) {
        console.log(err);
        response.msg = "err";
      } else {
        response.msg = "ok";
        response.filename = request.file.filename;
      }
      res.send(JSON.stringify(response));
    });
  });
};

/**
 * Sets response for user search.
 *
 * @param request
 * @param response
 */
exports.list = (request, response) => {
  const totalQuery = request.query.total;
  const params = {};
  if (totalQuery) {
    params.total = totalQuery;
  }
  const promise = groupService.search(params);
  const result = (groups) => {
    console.log("groups：");
    console.log(groups);
    groups.forEach((element) => {
      element.cover = "http://localhost:3300/img/user/" + element.cover;
    });
    response.status(200);
    response.json(groups);
  };
  promise.then(result).catch(renderErrorResponse(response));
};

/**
 * Creates a new user item and sets the response.
 *
 * @param request
 * @param response
 */
exports.save = (request, response) => {
  const group = Object.assign({}, request.body);
  groupService
    .search({ name: group.name })
    .then((u) => {
      if (u && u.length > 0) {
        response.status(200);
        response.json({
          errorCode: -1,
          msg: "The name is already registered",
        });
      } else {
        const result = (savedGroup) => {
          response.status(200);
          response.json({
            errorCode: 0,
            data: savedGroup.toObject(),
          });
        };
        const promise = groupService.save(group);
        promise.then(result).catch(renderErrorResponse(response));
      }
    })
    .catch(renderErrorResponse(response));
};

/**
 * Returns user response.
 *
 * @param request
 * @param response
 */
exports.get = (request, response) => {
  const groupId = request.params.id;
  console.log("groupId:" + groupId);
  const result = (group) => {
    response.status(200);
    response.json(group);
  };
  const promise = groupService.get(groupId);
  promise.then(result).catch(renderErrorResponse(response));
};

/**
 * Updates the user resource.
 *
 * @param request
 * @param response
 */
exports.update = (request, response) => {
  const groupId = request.params.id;
  const updatedGroup = Object.assign({}, request.body);
  updatedGroup.id = groupId;
  const result = (user) => {
    response.status(200);
    response.json(user);
  };
  const promise = groupService.update(updatedGroup);
  promise.then(result).catch(renderErrorResponse(response));
};

/**
 * Deletes an user resource.
 *
 * @param request
 * @param response
 */
exports.delete = (request, response) => {
  const groupId = request.params.id;
  const result = () => {
    response.status(200);
    response.json({
      message: "Successfully Deleted.",
    });
  };
  const promise = groupService.delete(groupId);
  promise.then(result).catch(renderErrorResponse(response));
};

/**
 * Throws error if error object is present.
 *
 * @param {Response} response The response object
 * @return {Function} The error handler function.
 */
let renderErrorResponse = (response) => {
  const errorCallback = (error) => {
    if (error) {
      response.status(500);
      response.json({
        message: error.message,
      });
    }
  };
  return errorCallback;
};
