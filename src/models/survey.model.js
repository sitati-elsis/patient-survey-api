const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { inputTypes } = require("../config/input.fields");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const preferenceSchema = new mongoose.Schema({
  _id: false,
  sendOnTeamBehalf: {
    type: Boolean,
  },
})

const questionSchema = mongoose.Schema(
  {
    _id: false,
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
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: inputTypes,
      default: "text",
      trim: true,
    },
    inputType: {
      type: String,
      enum: ['text', 'number', 'url', 'email'],
      default: "text",
      trim: true,
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    choices: {
      type: [{
        type: String,
      }],
      default: undefined
    },
    columns: {
      type: [{
        type: String,
      }],
      default: undefined
    },
    rows: {
      type: [{
        value: String,
        text: String
      }],
      default: undefined
    },

    /** rating type */

    rateMin: {
      type: Number,
    },
    rateMax: {
      type: Number,
    },
    minRateDescription: {
      type: String,
    },
    maxRateDescription: {
      type: String,
    },
    /** end rating type */
    order: {
      type: Number,
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
    timestamps: false,
  }
);

const surveySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    organizationId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Organization',
      required: true,
    },
    deliveryMethods: {
      type: [String],
      enum: ['sms', 'email'],
      default: ['email']
    },
    preferences: {
      type: preferenceSchema
    },
    elements: {
      type: [questionSchema]
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
surveySchema.plugin(toJSON);
surveySchema.plugin(paginate);

/**
 * Check if survey title exists for same organization
 * @param {string} title - The survey's title
 * @param {ObjectId} [organizationId] - The id of the organization owning the survey
 * @returns {Promise<boolean>}
 */
surveySchema.statics.nameExists = async function (title, organizationId, excludeSurveyId) {
  const survey = await this.findOne({ title, organizationId, ...(excludeSurveyId && { _id: { $ne: excludeSurveyId } }) });
  return !!survey;
};

/**
 * @typedef Survey
 */
const Survey = mongoose.model("Survey", surveySchema);

module.exports = Survey;
