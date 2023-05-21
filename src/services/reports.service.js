const { Campaign } = require("../models");

const getCampaignStatistics = async (organizationId) => {
  const campaignInformation = [];
  const organizationCampaigns = await Campaign.find({
    organizationId,
  }).populate("surveyId");

  for (let campaign of organizationCampaigns) {
    campaignInformation.push({
      campaignName: campaign.surveyId.title,
      campaignType: campaign.type,
      recipients: campaign.statistics.recipients,
      responses: campaign.statistics.responses,
      overalScore: campaign.statistics.overallScore,
    });
  }

  return campaignInformation;
};

module.exports = {
  getCampaignStatistics,
};
