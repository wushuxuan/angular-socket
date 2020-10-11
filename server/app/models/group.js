"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Mongoose schema for user object.
 */
let GroupSchema = new Schema(
  {
    name: {
      type: String,
      required: "name is missing",
    },
    cover: {
      type: String,
    },
    adminUser: {
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
GroupSchema.virtual("uid").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
GroupSchema.set("toJSON", {
  virtuals: true,
  transform: function (_, ret) {
    delete ret._id;
    delete ret.id;
  },
});
GroupSchema.set("toObject", {
  virtuals: true,
  transform: function (_, ret) {
    delete ret._id;
    delete ret.id;
    // ret.registerDate = +ret.registerDate;
  },
});

module.exports = mongoose.model("group", GroupSchema);
