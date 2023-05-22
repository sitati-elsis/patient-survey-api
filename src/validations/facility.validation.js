const Joi = require("joi");

const createFacility = {
  body: Joi.object().keys({
    facilityName: Joi.string().required(),
    facilityId: Joi.string(),
    facilityStatus: Joi.string(),
  }),
};

const getFacilities = {
  query: Joi.object().keys({
    facilityName: Joi.string(),
    faciltitId: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getFacility = {
  params: Joi.object().keys({
    facilityName: Joi.string(),
  }),
};

const updateFacility = {
  params: Joi.object().keys({
    facilityName: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      facilityName: Joi.string(),
      facilityId: Joi.string(),
      facilityStatus: Joi.string(),
    })
    .min(1),
};

const deleteFacility = {
  params: Joi.object().keys({
    facilityName: Joi.string(),
  }),
};
module.exports = {
  createFacility,
  getFacilities,
  getFacility,
  updateFacility,
  deleteFacility,
};
