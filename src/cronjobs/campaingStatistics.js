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

const calclulateNPS = async () => {
  logger.info(
    `updating campaigns statistics with nps info has started at ${new Date()}`
  );
  const organizationCampaigns = await Campaign.find({});
  for (let campaign of organizationCampaigns) {
    const survey = await Survey.find({ _id: campaign.surveyId });
    const npsQuestions = survey[0].elements
      .filter((element) => element.type === "rating" && element.rateMax === 10)
      .map((e) => e.name);
    const replies = await Reply.aggregate([
      {
        $unwind: "$response",
      },
      {
        $match: {
          "response.answer": { $regex: /^[0-9.]+$/ }, // Filter out non-numeric values
          "response.question": { $in: npsQuestions },
          campaignId: new mongoose.Types.ObjectId(campaign.id),
        },
      },
      {
        $group: {
          _id: "$campaignId",
          promoters: {
            $sum: {
              $cond: [{ $gte: ["$response.answer", 9] }, 1, 0],
            },
          },
          detractors: {
            $sum: {
              $cond: [{ $lte: ["$response.answer", 6] }, 1, 0],
            },
          },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          campaignId: "$_id",
          nps: {
            $cond: [
              {
                $eq: ["$total", 0],
              },
              null,
              {
                $subtract: [
                  {
                    $divide: [{ $multiply: ["$promoters", 100] }, "$total"],
                  },
                  {
                    $divide: [{ $multiply: ["$detractors", 100] }, "$total"],
                  },
                ],
              },
            ],
          },
          detractors: "$detractors", // Add detractors field
        },
      },
    ]);
    let nps;
    let detractors;
    if (replies.length === 0) {
      nps = 0;
      detractors = 0;
    } else {
      nps = replies[0].nps;
      detractors = replies[0].detractors;
    }

    const existingCampaign = await Campaign.findById(campaign.id);
    existingCampaign["statistics"]["nps"] = nps;
    existingCampaign["statistics"]["detractorsCount"] = detractors;
    await existingCampaign.updateOne(existingCampaign);
  }
  logger.info(
    `updating campaigns statistics with nps info has ended at ${new Date()}`
  );
};

module.exports = {
  updateCampaignStats: () => {
    cron.schedule("0 0 23 * * *", calculateCampaignStatistics);
    cron.schedule("0 0 23 * * *", calclulateNPS);
  },
};
