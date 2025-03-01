const mongoose = require("mongoose");
const { toJSON } = require("./plugins");
const { tokenTypes } = require("../config/tokens");

const patientSchema = new mongoose.Schema({
  _id: false,
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  email: {
    type: String,
  },
  doctor_id: {
    type: String,
  },
});

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL,
        tokenTypes.JOIN_TEAM,
        tokenTypes.SURVEY_RESPONSE,
      ],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: new mongoose.Schema({
        _id: false,
        campaignId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Campaign",
        },
        patient: {
          type: patientSchema,
        },
      }),
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
