const { Campaign, Reply, Token, Survey } = require("../models");

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

const getPractionerEngagements = async () => {
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
        user: { $concat: ["$user.firstName", " ", "$user.lastName"] },
        tokenCount: 1,
      },
    },
  ]);

  const respondedSurvey = await Reply.aggregate([
    {
      $group: {
        _id: "$patient.doctor_id",
        replyCount: { $sum: 1 },
      },
    },
  ]);
  const combinedResults = unresponsedSurvey.map((token) => {
    const matchingReply = respondedSurvey.find(
      (reply) => String(reply._id) === String(token._id)
    );
    const replyCount = matchingReply ? matchingReply.replyCount : 0;
    return {
      user: token.user,
      surveysSent: token.tokenCount + replyCount,
      responses: replyCount,
      ratio: (replyCount / (token.tokenCount + replyCount)) * 100,
    };
  });

  return combinedResults;
};

module.exports = {
  getCampaignStatistics,
  getPractionerEngagements,
};
