const catchAsync = require("../utils/catchAsync");
const { reportsService } = require("../services");

const getCampaignStatistics = catchAsync(async (req, res) => {
  const campaignStatistics = await reportsService.getCampaignStatistics(
    req.organizationId
  );
  res.send(campaignStatistics);
});

module.exports = {
  getCampaignStatistics,
};
