const Joi = require("joi");
const { objectId } = require("./custom.validation");

const getPatients = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    searchTerm: Joi.string(),
    patientMrn: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPatient = {
  params: Joi.object().keys({
    patientId: Joi.string().custom(objectId),
  }),
};

const updatePatient = {
  params: Joi.object().keys({
    patientId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      middleName: Joi.string(),
      mobilePhone: Joi.string(),
      homePhone: Joi.string(),
      gender: Joi.string(),
      address1: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipcode: Joi.string(),
      language: Joi.string(),
    })
    .min(1),
};

const deletePatient = {
  params: Joi.object().keys({
    patientId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
};
