const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const organizationRoute = require("./organization.route");
const surveyRoute = require("./survey.route");
const campaignRoute = require("./campaign.route");
const replyRoute = require("./reply.route");
const docsRoute = require("./docs.route");
const reportsRoute = require("./reports.route");
const facilityRoute = require("./facility.route")
const patientRoute = require('./patient.route');
const hookRoute = require('./hook.route');
const config = require("../../config/config");
const patientRoute = require('./patient.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/organizations",
    route: organizationRoute,
  },
  {
    path: "/surveys",
    route: surveyRoute,
  },
  {
    path: "/campaigns",
    route: campaignRoute,
  },
  {
    path: "/replies",
    route: replyRoute,
  },
  {
    path: "/reports",
    route: reportsRoute,
  },
  {
    path: "/facilities",
    route: facilityRoute,
  }, 
  { path: '/patients',
    route: patientRoute,
  },
  {
    path: "/hooks",
    route: hookRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
