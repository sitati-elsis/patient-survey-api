const Joi = require("joi");
const { objectId } = require("./custom.validation");
const { inputTypes } = require("../config/inputs");

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
    }),
    questions: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string(),
        type: Joi.string().required().valid(...inputTypes),
        isRequired: Joi.boolean(),
        choices: Joi.array().items(Joi.string()),
        columns: Joi.alternatives().conditional('type', {
          is: 'matrix',
          then: Joi.array().items(Joi.string()).required()
        }),
        rows: Joi.alternatives().conditional('type', {
          is: 'matrix',
          then: Joi.array().items(Joi.object().keys({
            value: Joi.string(),
            text: Joi.string(),
          }))
        }),
        rateMin: Joi.alternatives().conditional('type', {
          is: 'rating',
          then: Joi.number().required()
        }),
        rateMax: Joi.alternatives().conditional('type', {
          is: 'rating',
          then: Joi.number().required()
        }),
        minRateDescription: Joi.alternatives().conditional('type', { is: 'rating', then: Joi.string().required() }),
        maxRateDescription: Joi.alternatives().conditional('type', { is: 'rating', then: Joi.string().required() }),
        order: Joi.number(),
        visibleIf: Joi.string(),
        placeholder: Joi.string(),
        showOtherItem: Joi.boolean(),
        otherPlaceholder: Joi.string(),
        otherText: Joi.string(),
      })
    )
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
