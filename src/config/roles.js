const allRoles = {
  physician: ["getSuveys", "viewSurveys", "getSurveyReplies"],
  admin: [
    "getUsers",
    "manageUsers",
    "manageSurveys",
    "getSuveys",
    "manageOrganization",
    "getOrganizations",
    "manageSurveyReplies",
    "getSurveyReplies",
    "viewAdminReports",
    "manageFacilities",
    "getFacilities",
    "getPatients",
    "managePatients",
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
