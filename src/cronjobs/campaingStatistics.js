const mongoose = require("mongoose");
const cron = require("node-cron");
const { Campaign, Reply, Token, Survey } = require("../models");
const logger = require("../config/logger");

const calculateCampaignStatistics = async () => {
  logger.info(`updating campaigns statistics has started at ${new Date()}`);
  const organizationCampaigns = await Campaign.find({}).populate("surveyId");

  for (let campaign of organizationCampaigns) {
    const surveyTokens = await Token.find({
      type: "surveyResponse",
      "metadata.campaignId": campaign.id,
    }).count({ type: "surveyResponse" });
    const repliesCount = await Reply.find({ campaignId: campaign.id }).count({
      campaignId: campaign.id,
    });
    const totalSurveysSent = surveyTokens + repliesCount;
    const survey = await Survey.find({ _id: campaign.surveyId });
    const ratingsQuestions = survey[0].elements
      .filter((element) => element.type === "rating" && element.rateMax !== 10)
      .map((e) => e.name);

    const replies = await Reply.aggregate([
      { $unwind: "$response" },
      {
        $match: {
          "response.question": { $in: ratingsQuestions },
          campaignId: new mongoose.Types.ObjectId(campaign.id),
        },
      },
      {
        $group: {
          _id: "$campaignId",
          totalScore: {
            $sum: {
              $toInt: "$response.answer",
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          campaignId: "$_id",
          averageScore: {
            $divide: ["$totalScore", "$count"],
          },
        },
      },
    ]);
    let averageScore;
    if (replies.length === 0) {
      averageScore = 0;
    } else {
      averageScore = replies[0].averageScore;
    }
    const existingCampaign = await Campaign.findById(campaign.id);
    Object.assign(existingCampaign, {
      statistics: {
        recipients: totalSurveysSent,
        responses: repliesCount,
        overallScore: averageScore,
      },
    });

    await existingCampaign.updateOne(existingCampaign);
  }
  logger.info(`updating campaigns statistics has ended at ${new Date()}`);
};

module.exports = {
  updateCampaignStats: () => {
    cron.schedule("0 0 23 * * *", calculateCampaignStatistics);
  },
};
