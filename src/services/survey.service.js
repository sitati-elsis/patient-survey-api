const httpStatus = require('http-status');
const { Survey } = require('../models');
const ApiError = require('../utils/ApiError');
const organizationService = require('./organization.service')

/**
 * Create a survey
 * @param {Object} surveyBody
 * @returns {Promise<Survey>}
 */
const createSurvey = async (organizationId, surveyBody) => {
  const organization = await organizationService.getOrganizatioById(organizationId);
  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, `Organization not found`);
  }
  if (await Survey.nameExists(surveyBody.name, organization.id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'A survey with the name already exists for this organization');
  }
  const survey = Object.assign(surveyBody, { organizationId })
  return Survey.create(survey);
};

/**
 * Query for surveys
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySurveys = async (filter, options) => {
  const surveys = await Survey.paginate(filter, options);
  return surveys;
};

/**
 * Get survey by id
 * @param {ObjectId} id
 * @returns {Promise<Survey>}
 */
const getSurveyById = async (id) => {
  return Survey.findById(id);
};

/**
 * Update survey by id
 * @param {ObjectId} surveyId
 * @param {Object} updateBody
 * @returns {Promise<Survey>}
 */
const updateSurveyById = async (surveyId, updateBody) => {
  const survey = await getSurveyById(surveyId);
  if (!survey) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey not found');
  }
  if (updateBody.name && (await Survey.nameExists(updateBody.name, survey.organization.id, surveyId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'A survey with the name already exists for this organization');
  }
  Object.assign(survey, updateBody);
  await survey.save();
  return survey;
};

/**
 * Delete survey by id
 * @param {ObjectId} surveyId
 * @returns {Promise<Survey>}
 */
const deleteSurveyById = async (surveyId) => {
  const survey = await getSurveyById(surveyId);
  if (!survey) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey not found');
  }
  await survey.deleteOne();
  return survey;
};

module.exports = {
  createSurvey,
  getSurveyById,
  querySurveys,
  updateSurveyById,
  deleteSurveyById,
};
