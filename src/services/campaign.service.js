const httpStatus = require("http-status");
const { Campaign, Survey } = require("../models");
const ApiError = require("../utils/ApiError");
const organizationService = require("./organization.service");
const dummyPatients = require("../config/dummyPatients");
const { tokenService, emailService } = require(".");

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
  if (await Campaign.isOrganizationLimitReached(survey.organizationId)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Limit for active campaigns reached for this organization"
    );
  }
  const campaign = Object.assign(campaignBody, {
    surveyId,
    organizationId: survey.organizationId,
  });
  const newCampaign = await Campaign.create(campaign);
  let practitionerIds = campaign?.practitionerIds || [];
  if (practitionerIds.length === 0) {
    const organization = await organizationService.getOrganizatioById(
      survey.organizationId
    );
    const { users } = organization;
    practitionerIds = users.map((u) => u.userId.toString());
  }
  const patients = dummyPatients.filter((p) =>
    practitionerIds.includes(p.doctor_id)
  );
  for (let patient of patients) {
    const metadata = {
      campaignId: newCampaign.id,
      patient,
    };
    const token = await tokenService.generateSurveyResponseToken(
      patient.doctor_id,
      metadata
    );
    emailService.sendSurveyEmail(patient, token, {
      campaignId: newCampaign.id,
      surveyId,
    });
  }

  return newCampaign;
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
    throw new ApiError(httpStatus.NOT_FOUND, "Campaign not found");
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
    throw new ApiError(httpStatus.NOT_FOUND, "Campaign not found");
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
