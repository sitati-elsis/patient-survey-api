const Joi = require("joi");
const { objectId } = require("./custom.validation");
const { surveyTypes } = require("../config/survey.types");

const createCampaign = {
  query: Joi.object().keys({
    surveyId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    type: Joi.string().required().valid(...surveyTypes),
    autoPublish: Joi.boolean(),
    deliverySchedule: Joi.object().keys({
      afterDischarge: Joi.boolean(),
      dischargeStartDate: Joi.date(),
    }).or('afterDischarge', 'dischargeStartDate').min(1).max(1),
    practitionerIds: Joi.array().items(Joi.string().custom(objectId)),
  }),
};

const getCampaigns = {
  query: Joi.object().keys({
    surveyId: Joi.string().custom(objectId),
    organizationId: Joi.string().custom(objectId),
    type: Joi.string().valid(...surveyTypes),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCampaign = {
  params: Joi.object().keys({
    campaignId: Joi.string().custom(objectId),
  }),
};

const updateCampaign = {
  params: Joi.object().keys({
    campaignId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    type: Joi.string().valid(...surveyTypes),
    autoPublish: Joi.boolean(),
    deliverySchedule: Joi.object().keys({
      afterDischarge: Joi.boolean(),
      dischargeStartDate: Joi.date()
    }),
    practitionerIds: Joi.array().items(Joi.string().custom(objectId)),
  }).min(1),
};

const deleteCampaign = {
  params: Joi.object().keys({
    campaignId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
};
