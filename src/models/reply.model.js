const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const responseSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String || Number || Array,
    required: true,
  },
});
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

const replySchema = mongoose.Schema(
  {
    campaignId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Campaign",
      required: true,
    },
    response: {
      type: [responseSchema],
      required: true,
    },
    patient: {
      type: patientSchema,
    },
    organizationId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
replySchema.plugin(toJSON);
replySchema.plugin(paginate);

/**
 * @typedef Reply
 */
const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
