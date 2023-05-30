const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { surveyTypes } = require("../config/survey.types");
const config = require("../config/config");

const statisticsSchema = new mongoose.Schema(
  {
    _id: false,
    recipients: {
      type: Number,
    },
    responses: {
      type: Number,
    },
    overallScore: {
      type: Number,
    },
    nps: {
      type: Number,
    },
    detractorsCount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const campaignSchema = mongoose.Schema(
  {
    surveyId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Survey",
      required: true,
    },
    organizationId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Organization",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: surveyTypes,
      trim: true,
    },
    practitionerIds: {
      type: [mongoose.SchemaTypes.ObjectId],
    },
    deliverySchedule: {
      type: mongoose.Schema({
        _id: false,
        afterDischarge: {
          type: Boolean,
        },
        dischargeStartDate: {
          type: Date,
        },
      }),
    },
    autoPublish: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "paused", "archived"],
      default: "active",
    },
    statistics: {
      type: statisticsSchema,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
campaignSchema.plugin(toJSON);
campaignSchema.plugin(paginate);

/**
 * Check if organization has reached limit for active campaigns
 * @param {string} organizationId - The organization's id
 * @returns {Promise<boolean>}
 */
campaignSchema.statics.isOrganizationLimitReached = async function (
  organizationId
) {
  const currentCampaignsCount = await this.count({
    organizationId,
    status: "active",
  });
  return currentCampaignsCount >= config.campaigns.limitPerOrganization;
};

campaignSchema.pre("validate", function (next) {
  if (
    (this.deliverySchedule.afterDischarge &&
      this.deliverySchedule.dischargeStartDate) ||
    (!this.deliverySchedule.afterDischarge &&
      !this.deliverySchedule.dischargeStartDate)
  )
    return next(
      new Error(
        "At least and Only one field(deliverySchedule.afterDischarge, deliverySchedule.dischargeStartDate) should be populated"
      )
    );
  next();
});

/**
 * @typedef Campaign
 */
const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;
