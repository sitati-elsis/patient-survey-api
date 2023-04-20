const Joi = require("joi");
const { objectId } = require("./custom.validation");
const { inputTypes } = require("../config/input.fields");

const createSurvey = {
  query: Joi.object().keys({
    organizationId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    logo: Joi.string(),
    description: Joi.string(),
    deliveryMethods: Joi.array().items(Joi.string()),
    preferences: Joi.object().keys({
      sendOnTeamBehalf: Joi.boolean(),
    }),
    elements: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string(),
        type: Joi.string().required().valid(...inputTypes),
        inputType: Joi.string(),
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
          then: Joi.number()
        }),
        rateMax: Joi.alternatives().conditional('type', {
          is: 'rating',
          then: Joi.number()
        }),
        minRateDescription: Joi.alternatives().conditional('type', { is: 'rating', then: Joi.string().required() }),
        maxRateDescription: Joi.alternatives().conditional('type', { is: 'rating', then: Joi.string().required() }),
        order: Joi.number(),
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
    title: Joi.string(),
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
      title: Joi.string(),
      deliveryMethods: Joi.array().items(Joi.string()),
      preferences: Joi.object().keys({
        sendOnTeamBehalf: Joi.boolean(),
      }),
      elements: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          title: Joi.string().required(),
          description: Joi.string(),
          type: Joi.string().required().valid(...inputTypes),
          inputType: Joi.string(),
          isRequired: Joi.boolean(),
          choices: Joi.array().items(Joi.string()),
          columns: Joi.alternatives().conditional('type', {
            is: 'matrix',
            then: Joi.array().items(Joi.string())
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
            then: Joi.number()
          }),
          rateMax: Joi.alternatives().conditional('type', {
            is: 'rating',
            then: Joi.number()
          }),
          minRateDescription: Joi.alternatives().conditional('type', { is: 'rating', then: Joi.string() }),
          maxRateDescription: Joi.alternatives().conditional('type', { is: 'rating', then: Joi.string() }),
          order: Joi.number(),
          placeholder: Joi.string(),
          showOtherItem: Joi.boolean(),
          otherPlaceholder: Joi.string(),
          otherText: Joi.string(),
        })
      )
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
