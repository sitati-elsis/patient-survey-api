const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const preferenceSchema = new mongoose.Schema({
  membersCanSendManual: {
    type: Boolean,
  },
  sendOnTeamBehalf: {
    type: Boolean,
  },
})

const surveySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    organizationId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Organization',
    },
    deliveryMethods: {
      type: [String],
      enum: ['sms', 'email'],
      default: ['email']
    },
    preferences: {
      type: preferenceSchema
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
 * Check if survey name exists for same organization
 * @param {string} name - The survey's name
 * @param {ObjectId} [organizationId] - The id of the organization owning the survey
 * @returns {Promise<boolean>}
 */
surveySchema.statics.nameExists = async function (name, organizationId, excludeSurveyId) {
  const survey = await this.findOne({ name, organizationId, ...(excludeSurveyId && { _id: { $ne: excludeSurveyId } }) });
  return !!survey;
};

/**
 * @typedef Survey
 */
const Survey = mongoose.model("Survey", surveySchema);

module.exports = Survey;
