const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { inputTypes } = require("../config/inputs");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const questionSchema = mongoose.Schema(
  {
    surveyId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Survey',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: inputTypes,
      default: "text",
      trim: true,
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    choices: [{
      type: String,
    }],
    columns: [{
      type: String,
    }],
    rows: [{
      value: String,
      text: String
    }],
    order: {
      type: Number,
    },
    visibleIf: {
      type: String
    },
    placeholder: {
      type: String,
      trim: true,
    },
    showOtherItem: {
      type: Boolean,
    },
    otherPlaceholder: {
      type: String,
    },
    otherText: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
questionSchema.plugin(toJSON);
questionSchema.plugin(paginate);

/**
 * Check if question name exists for same survey
 * @param {string} name - The question's name
 * @param {ObjectId} [surveyId] - The id of the survey owning the question
 * @returns {Promise<boolean>}
 */
questionSchema.statics.nameExists = async function (name, surveyId) {
  const question = await this.findOne({ name, surveyId });
  return !!question;
};

/**
 * @typedef Question
 */
const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
