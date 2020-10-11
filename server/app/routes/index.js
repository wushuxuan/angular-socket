"use strict";

const userRoute = require("./user-route");
const groupRoute = require("./group-route");
const channelRoute = require("./channel-route");

module.exports = (app) => {
  userRoute(app);
  groupRoute(app);
  channelRoute(app);
};
