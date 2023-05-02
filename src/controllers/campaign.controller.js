const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { campaignService, surveyService } = require('../services');

const createCampaign = catchAsync(async (req, res) => {
  const { surveyId } = req.query
  const campaign = await campaignService.createCampaign(surveyId, req.body);
  res.status(httpStatus.CREATED).send(campaign);
});

const getCampaigns = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['surveyId', 'type']);
  const { organizationId } = req.query
  if (organizationId) {
    const surveys = await surveyService.getSurveysByOrganizationId(organizationId)
    filter.surveyId = {
      $in: surveys.map(s => s.id)
    }
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await campaignService.queryCampaigns(filter, options);
  res.send(result);
});

const getCampaign = catchAsync(async (req, res) => {
  const campaign = await campaignService.getCampaignById(req.params.campaignId);
  if (!campaign) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Campaign not found');
  }
  res.send(campaign);
});

const updateCamapign = catchAsync(async (req, res) => {
  const campaign = await campaignService.updateCampaignById(req.params.campaignId, req.body);
  res.send(campaign);
});

const deleteCampaign = catchAsync(async (req, res) => {
  await campaignService.deleteCampaignById(req.params.campaignId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCamapign,
  deleteCampaign,
};
