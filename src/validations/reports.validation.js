const Joi = require("joi");
const { objectId } = require("./custom.validation");
const { surveyTypes } = require("../config/survey.types");

const getCampaignStatistics = {
  query: Joi.object().keys({
    campaignId: Joi.string().custom(objectId),
    startDate: Joi.date(),
    endDate: Joi.date(),
    practitionerId: Joi.string().custom(objectId),
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
  }),
};

const getPractionerEngagements = {
  query: Joi.object().keys({
    campaignId: Joi.string().custom(objectId),
    startDate: Joi.date(),
    endDate: Joi.date(),
    practitionerId: Joi.string().custom(objectId),
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
  }),
};

module.exports = {
  getCampaignStatistics,
  getPractionerEngagements,
};
