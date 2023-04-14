const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { surveyService } = require('../services');

const createSurvey = catchAsync(async (req, res) => {
  const { organizationId } = req.query
  const survey = await surveyService.createSurvey(organizationId, req.body);
  res.status(httpStatus.CREATED).send(survey);
});

const getSurveys = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'status', 'organizationId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await surveyService.querySurveys(filter, options);
  res.send(result);
});

const getSurvey = catchAsync(async (req, res) => {
  const survey = await surveyService.getSurveyById(req.params.surveyId);
  if (!survey) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey not found');
  }
  res.send(survey);
});

const updateSurvey = catchAsync(async (req, res) => {
  const survey = await surveyService.updateSurveyById(req.params.surveyId, req.body);
  res.send(survey);
});

const deleteSurvey = catchAsync(async (req, res) => {
  await surveyService.deleteSurveyById(req.params.surveyId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSurvey,
  getSurveys,
  getSurvey,
  updateSurvey,
  deleteSurvey,
};
