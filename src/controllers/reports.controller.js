const catchAsync = require("../utils/catchAsync");
const { reportsService } = require("../services");

const getCampaignStatistics = catchAsync(async (req, res) => {
  const {
    campaignId,
    startDate,
    endDate,
    practitionerId,
    page = 1,
    limit = 10,
  } = req.query;
  const organizationId = req.organizationId;
  const campaignStatistics = await reportsService.getCampaignStatistics(
    organizationId,
    campaignId,
    startDate,
    endDate,
    practitionerId,
    page,
    limit
  );
  const count = campaignStatistics.length;
  res.send({
    campaignStatistics,
    totalPages: Math.ceil(count / parseInt(limit)),
    currentPage: page,
  });
});

const getPractionerEngagements = catchAsync(async (req, res) => {
  const {
    startDate,
    endDate,
    practitionerId,
    page = 1,
    limit = 10,
  } = req.query;
  const organizationId = req.organizationId;

  const practionerEngangements = await reportsService.getPractionerEngagements(
    organizationId,
    startDate,
    endDate,
    practitionerId,
    page,
    limit
  );

  res.send(practionerEngangements);
});

module.exports = {
  getCampaignStatistics,
  getPractionerEngagements,
};
