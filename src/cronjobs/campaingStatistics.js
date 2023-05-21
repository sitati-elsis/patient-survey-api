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
      {
        $unwind: "$response",
      },
      {
        $match: {
          "response.answer": { $regex: /^[0-9.]+$/ }, // Filter out non-numeric values
          "response.question": { $in: ratingsQuestions },
          campaignId: new mongoose.Types.ObjectId(campaign.id),
        },
      },
      {
        $group: {
          _id: {
            campaignId: "$campaignId",
            answer: "$response.answer",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.campaignId",
          totalResponses: { $sum: "$count" },
          answers: {
            $push: {
              answer: "$_id.answer",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          campaignId: "$_id",
          weightedAverage: {
            $reduce: {
              input: "$answers",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  {
                    $multiply: [
                      {
                        $toDouble: "$$this.answer",
                      },
                      {
                        $divide: ["$$this.count", "$totalResponses"],
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    ]);
    if (replies.length === 0) {
      weightedAverage = 0;
    } else {
      weightedAverage = replies[0].weightedAverage;
    }
    const existingCampaign = await Campaign.findById(campaign.id);
    Object.assign(existingCampaign, {
      statistics: {
        recipients: totalSurveysSent,
        responses: repliesCount,
        overallScore: weightedAverage,
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
