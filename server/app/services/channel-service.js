"use strict";
const mongoose = require("mongoose"),
  Channel = mongoose.model("channel");

/**
 * Returns a promise for search results.
 *
 * @param search param.
 */
exports.search = (params) => {
  const promise = Channel.find(params);
  return promise;
};

/**
 * Saves the new Channel object.
 *
 * @param Channel
 */
exports.save = (channel) => {
  console.log("进入save service");
  const newChannel = new Channel(channel);
  return newChannel.save();
};

/**
 * Returns the Channel object by id.
 *
 * @param ChannelId
 */
exports.get = (id) => {
  const ChannelPromise = Channel.find({ groupId: id }).exec();
  return ChannelPromise;
};

/**
 * Updates an existing Channel item.
 *
 * @param updatedChannel
 */
exports.update = (updatedChannel) => {
  const promise = Channel.findByIdAndUpdate(
    updatedChannel.id,
    updatedChannel
  ).exec();
  return promise;
};

/**
 * Deletes an existing Channel.
 *
 * @param ChannelId
 */
exports.delete = (ChannelId) => {
  const promise = Channel.findByIdAndRemove(ChannelId).exec();
  return promise;
};
