"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Mongoose schema for user object.
 */
let ChannelSchema = new Schema(
  {
    name: {
      type: String,
      required: "name is missing",
    },
    users: {
      type: Array,
    },
    groupId: {
      type: String,
    },
    adminUser: {
      type: Array,
    },
    record: {
      type: Array,
    },
    registerDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "registerDate" },
  }
);
// Duplicate the id field as mongoose returns _id field instead of id.
ChannelSchema.virtual("uid").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ChannelSchema.set("toJSON", {
  virtuals: true,
  transform: function (_, ret) {
    delete ret._id;
    delete ret.id;
  },
});
ChannelSchema.set("toObject", {
  virtuals: true,
  transform: function (_, ret) {
    delete ret._id;
    delete ret.id;
    // ret.registerDate = +ret.registerDate;
  },
});

module.exports = mongoose.model("channel", ChannelSchema);
