const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { surveyTypes } = require("../config/survey.types");

const campaignSchema = mongoose.Schema(
  {
    surveyId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Survey',
    },
    type: {
      type: String,
      required: true,
      enum: surveyTypes,
      trim: true,
    },
    practitionerIds: {
      type: [mongoose.SchemaTypes.ObjectId]
    },
    deliverySchedule: {
      type: mongoose.Schema({
        _id: false,
        afterDischarge: {
          type: Boolean
        },
        dischargeStartDate: {
          type: Date
        }
      })
    },
    autoPublish: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
campaignSchema.plugin(toJSON);
campaignSchema.plugin(paginate);

campaignSchema.pre('validate', function (next) {
  if((this.deliverySchedule.afterDischarge && this.deliverySchedule.dischargeStartDate) || (!this.deliverySchedule.afterDischarge && !this.deliverySchedule.dischargeStartDate))
      return next(new Error("At least and Only one field(deliverySchedule.afterDischarge, deliverySchedule.dischargeStartDate) should be populated"))
  next()
})

/**
 * @typedef Campaign
 */
const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;
