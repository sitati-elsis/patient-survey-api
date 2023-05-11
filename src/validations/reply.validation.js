const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createReply = {
  query: Joi.object().keys({
    campaignId: Joi.string().required().custom(objectId),
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    response: Joi.array().items(Joi.object().keys({
      question: Joi.string().required(),
      answer: Joi.any().required()
    })).required(),
  }),
};

const getReplies = {
  query: Joi.object().keys({
    campaignId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReply = {
  params: Joi.object().keys({
    replyId: Joi.string().custom(objectId),
  }),
};

const updateReply = {
  params: Joi.object().keys({
    replyId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      response: Joi.array().items(Joi.object().keys({
        question: Joi.string(),
        answer: Joi.any()
      })),
    })
    .min(1),
};

const deleteReply = {
  params: Joi.object().keys({
    replyId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createReply,
  getReplies,
  getReply,
  updateReply,
  deleteReply,
};
