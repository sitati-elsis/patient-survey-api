const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createSurvey = {
  query: Joi.object().keys({
    organizationId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    deliveryMethods: Joi.array().items(Joi.string()),
    preferences: Joi.object().keys({
      membersCanSendManual: Joi.boolean(),
      sendOnTeamBehalf: Joi.boolean(),
    })
  }),
};

const getSurveys = {
  query: Joi.object().keys({
    name: Joi.string(),
    organizationId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSurvey = {
  params: Joi.object().keys({
    surveyId: Joi.string().custom(objectId),
  }),
};

const updateSurvey = {
  params: Joi.object().keys({
    surveyId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      description: Joi.string(),
      name: Joi.string(),
      deliveryMethods: Joi.array().items(Joi.string()),
      preferences: Joi.object().keys({
        membersCanSendManual: Joi.boolean(),
        sendOnTeamBehalf: Joi.boolean(),
      })
    })
    .min(1),
};

const deleteSurvey = {
  params: Joi.object().keys({
    surveyId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSurvey,
  getSurveys,
  getSurvey,
  updateSurvey,
  deleteSurvey,
};
