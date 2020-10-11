"use strict";

const userService = require("../services/user-service");
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
  const promise = userService.search(params);
  const result = (users) => {
    users.forEach((element) => {
      element.avatar = "http://localhost:3300/img/user/" + element.avatar;
    });
    response.status(200);
    response.json(users);
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
  const user = Object.assign({}, request.body);
  userService
    .search({ email: user.email })
    .then((u) => {
      if (u && u.length > 0) {
        response.status(200);
        response.json({
          errorCode: -1,
          msg: "The email is already registered",
        });
      } else {
        const result = (savedUser) => {
          response.status(200);
          response.json({
            errorCode: 0,
            data: savedUser.toObject(),
          });
        };
        const promise = userService.save(user);
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
  const userId = request.params.id;
  const result = (user) => {
    response.status(200);
    response.json(user);
  };
  const promise = userService.get(userId);
  promise.then(result).catch(renderErrorResponse(response));
};

/**
 * User log in.
 *
 * @param request
 * @param response
 */
exports.login = (request, response) => {
  const promise = userService.search({
    username: request.body.username,
    password: request.body.password,
  });
  promise
    .then((r) => {
      console.log("r:");
      console.log(r);
      if (r && r.length == 0) {
        response.status(500);
        response.json({
          msg: "error",
        });
      } else {
        response.status(200);
        response.json({
          data: r[0],
        });
      }
    })
    .catch(renderErrorResponse(response));
};

/**
 * Updates the user resource.
 *
 * @param request
 * @param response
 */
exports.update = (request, response) => {
  const userId = request.params.id;
  const updatedUser = Object.assign({}, request.body);
  console.log("userId:" + userId);
  updatedUser.id = userId;
  const result = (user) => {
    response.status(200);
    response.json(user);
  };
  const promise = userService.update(updatedUser);
  promise.then(result).catch(renderErrorResponse(response));
};

/**
 * Deletes an user resource.
 *
 * @param request
 * @param response
 */
exports.delete = (request, response) => {
  const userId = request.params.id;
  const result = () => {
    response.status(200);
    response.json({
      message: "Successfully Deleted.",
    });
  };
  const promise = userService.delete(userId);
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
