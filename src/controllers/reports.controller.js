const catchAsync = require("../utils/catchAsync");
const { reportsService } = require("../services");

const getCampaignStatistics = catchAsync(async (req, res) => {
  const campaignStatistics = await reportsService.getCampaignStatistics(
    req.organizationId
  );
  res.send(campaignStatistics);
});

const getPractionerEngagements = catchAsync(async (req, res) => {
  const practionerEngangements =
    await reportsService.getPractionerEngagements();

  res.send(practionerEngangements);
});

module.exports = {
  getCampaignStatistics,
  getPractionerEngagements,
};
