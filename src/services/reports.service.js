const { Campaign, Reply, Token, Survey } = require("../models");

const getCampaignStatistics = async (
  organizationId,
  campaignId = null,
  startDate = null,
  endDate = null,
  practitionerId = null,
  page,
  limit
) => {
  let campaignInformation = [];

  const query = { organizationId: organizationId };
  if (campaignId) {
    query._id = campaignId;
  }

  if (startDate && endDate) {
    query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  if (campaignId && startDate && endDate) {
    (query._id = campaignId),
      (query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      });
  }
  let organizationCampaigns;
  if (!practitionerId) {
    organizationCampaigns = await Campaign.find(query)
      .populate("surveyId")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    for (let campaign of organizationCampaigns) {
      campaignInformation.push({
        campaignName: campaign.surveyId.title,
        campaignType: campaign.type,
        recipients: campaign.statistics.recipients,
        responses: campaign.statistics.responses,
        overalScore: campaign.statistics.overallScore,
      });
    }
  } else {
    const replies = await Reply.find({ "patient.doctor_id": practitionerId });
    const campaignIds = replies.map((reply) => reply.campaignId);
    const filter = {
      _id: { $in: campaignIds },
      organizationId: organizationId,
    };
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    organizationCampaigns = await Campaign.find(filter)
      .populate("surveyId")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();
    for (let campaign of organizationCampaigns) {
      campaignInformation.push({
        campaignName: campaign.surveyId.title,
        campaignType: campaign.type,
        recipients: campaign.statistics.recipients,
        responses: campaign.statistics.responses,
        overalScore: campaign.statistics.overallScore,
      });
    }
  }

  return campaignInformation;
};

const getPractionerEngagements = async (
  organizationId,
  startDate = null,
  endDate = null,
  practitionerId = null,
  page,
  limit
) => {
  const unresponsedSurvey = await Token.aggregate([
    {
      $group: {
        _id: "$user",
        tokenCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        user: "$user",
        userId: "$_id",
        tokenCount: 1,
      },
    },
  ]);

  const respondedSurvey = await Reply.aggregate([
    {
      $group: {
        _id: "$patient.doctor_id",
        replyCount: { $sum: 1 },
        createdAt: { $first: "$createdAt" }, // Include createdAt field from Reply collection
      },
    },
  ]);

  let combinedResults = unresponsedSurvey.map((token) => {
    const matchingReply = respondedSurvey.find(
      (reply) => String(reply._id) === String(token.userId)
    );
    const replyCount = matchingReply ? matchingReply.replyCount : 0;
    return {
      user: token.user,
      userId: token.userId,
      surveysSent: token.tokenCount + replyCount,
      responses: replyCount,
      ratio: (replyCount / (token.tokenCount + replyCount)) * 100,
      createdAt: matchingReply ? matchingReply.createdAt : null,
    };
  });

  // Apply filters
  if (practitionerId) {
    combinedResults = combinedResults.filter(
      (result) => String(result.userId) === String(practitionerId)
    );
  }
  if (startDate && endDate) {
    combinedResults = combinedResults.filter((result) => {
      const createdAt = new Date(result.createdAt);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return createdAt >= startDateObj && createdAt <= endDateObj;
    });
  }

  const totalCount = combinedResults.length;

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = combinedResults.slice(startIndex, endIndex);

  return {
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    results: paginatedResults,
    totalResults: totalCount
  };
};

module.exports = {
  getCampaignStatistics,
  getPractionerEngagements,
};
