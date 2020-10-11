"use strict";
const mongoose = require("mongoose"),
  Group = mongoose.model("group");

/**
 * Returns a promise for search results.
 *
 * @param search param.
 */
exports.search = (params) => {
  const promise = Group.find(params);
  return promise;
};

/**
 * Saves the new Group object.
 *
 * @param Group
 */
exports.save = (group) => {
  console.log("进入save service");
  const newGroup = new Group(group);
  return newGroup.save();
};

/**
 * Returns the Group object by id.
 *
 * @param GroupId
 */
exports.get = (uid) => {
  const GroupPromise = Group.find({ _id: uid }).exec();
  return GroupPromise;
};

/**
 * Updates an existing Group item.
 *
 * @param updatedGroup
 */
exports.update = (updatedGroup) => {
  const promise = Group.findByIdAndUpdate(updatedGroup.id, updatedGroup).exec();
  return promise;
};

/**
 * Deletes an existing Group.
 *
 * @param GroupId
 */
exports.delete = (GroupId) => {
  const promise = Group.findByIdAndRemove(GroupId).exec();
  return promise;
};
