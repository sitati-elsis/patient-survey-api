const { Campaign, Reply, Token, Survey } = require("../models");
const mongoose = require("mongoose");

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

  const query = { organizationId };
  if (campaignId) {
    query._id = campaignId;
  }

  if (startDate && endDate) {
    query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
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
        recipients: campaign?.statistics?.recipients || 0,
        responses: campaign?.statistics?.responses || 0,
        overalScore: campaign?.statistics?.overallScore || 0,
      });
    }
  } else {
    const replies = await Reply.find({ "patient.doctor_id": practitionerId });
    const campaignIds = replies.map((reply) => reply.campaignId);
    const filter = {
      _id: { $in: campaignIds },
      organizationId: organizationId,
      ...(startDate && endDate && {createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }})
    };
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
        recipients: campaign?.statistics?.recipients || 0,
        responses: campaign?.statistics?.responses || 0,
        overalScore: campaign?.statistics?.overallScore || 0,
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
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $group: {
        _id: "$user._id",
        firstName: { $first: "$user.firstName" },
        lastName: { $first: "$user.lastName" },
        tokenCount: { $sum: 1 },
      },
    },
  ]);

  const organizationObjectId = new mongoose.Types.ObjectId(organizationId);
  const respondedSurvey = await Reply.aggregate([
    {
      $group: {
        _id: "$patient.doctor_id",
        replyCount: { $sum: 1 },
        createdAt: { $first: "$createdAt" }, // Include createdAt field from Reply collection
        organizationId: { $first: "$organizationId" },
      },
    },
  ]);

  let combinedResults = unresponsedSurvey.map((token) => {
    const matchingReply = respondedSurvey.find(
      (reply) => String(reply._id) === String(token._id)
    );
    const replyCount = matchingReply ? matchingReply.replyCount : 0;
    return {
      userName: `${token.firstName} ${token.lastName}`,
      userId: token._id,
      surveysSent: token.tokenCount + replyCount,
      responses: replyCount,
      ratio: (replyCount / (token.tokenCount + replyCount)) * 100,
      createdAt: matchingReply ? matchingReply.createdAt : null,
      organizationId: matchingReply ? matchingReply.organizationId : null, // Include organizationId field in combinedResults
    };
  });

  // Filter by organizationId
  combinedResults = combinedResults.filter(
    (result) => String(result.organizationId) === String(organizationId)
  );
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
