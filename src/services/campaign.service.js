const httpStatus = require('http-status');
const { Campaign, Survey } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a campaign
 * @param {Object} campaignBody
 * @returns {Promise<Campaign>}
 */
const createCampaign = async (surveyId, campaignBody) => {
  const survey = await Survey.findById(surveyId);
  if (!survey) {
    throw new ApiError(httpStatus.NOT_FOUND, `Survey not found`);
  }
  const campaign = Object.assign(campaignBody, { surveyId })
  return Campaign.create(campaign);
};

/**
 * Query for campaigns
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCampaigns = async (filter, options) => {
  const campaigns = await Campaign.paginate(filter, options);
  return campaigns;
};

/**
 * Get campaign by id
 * @param {ObjectId} id
 * @returns {Promise<Campaign>}
 */
const getCampaignById = async (id) => {
  return Campaign.findById(id);
};

/**
 * Update campaign by id
 * @param {ObjectId} campaignId
 * @param {Object} updateBody
 * @returns {Promise<Campaign>}
 */
const updateCampaignById = async (campaignId, updateBody) => {
  const campaign = await getCampaignById(campaignId);
  if (!campaign) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Campaign not found');
  }
  Object.assign(campaign, updateBody);
  await campaign.save();
  return campaign;
};

/**
 * Delete campaign by id
 * @param {ObjectId} campaignId
 * @returns {Promise<Campaign>}
 */
const deleteCampaignById = async (campaignId) => {
  const campaign = await getCampaignById(campaignId);
  if (!campaign) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Campaign not found');
  }
  await campaign.deleteOne();
  return campaign;
};

module.exports = {
  createCampaign,
  queryCampaigns,
  getCampaignById,
  updateCampaignById,
  deleteCampaignById,
};
