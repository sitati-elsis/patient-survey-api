const allRoles = {
  physician: ["getSuveys", "viewSurveys"],
  admin: [
    "getUsers", 
    "manageUsers", 
    "manageSurveys", 
    "getSuveys",
    "manageOrganization", 
    "getOrganizations"
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
