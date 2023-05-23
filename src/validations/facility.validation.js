const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createFacility = {
  body: Joi.object().keys({
    facilityName: Joi.string().required(),
    facilityFhirId: Joi.string(),
  }),
};

const getFacilities = {
  query: Joi.object().keys({
    facilityName: Joi.string(),
    facilityFhirId: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getFacility = {
  params: Joi.object().keys({
    facilityId: Joi.string().custom(objectId),
  }),
};

const updateFacility = {
  params: Joi.object().keys({
    facilityId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      facilityName: Joi.string(),
      facilityFhirId: Joi.string(),
      status: Joi.string(),
    })
    .min(1),
};

const deleteFacility = {
  params: Joi.object().keys({
    facilityId: Joi.string().custom(objectId),
  }),
};
module.exports = {
  createFacility,
  getFacilities,
  getFacility,
  updateFacility,
  deleteFacility,
};
