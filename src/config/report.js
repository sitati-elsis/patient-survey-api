const types = {
  "practitioner-management": "Practitioner management",
  "surveys-effectiveness": "Surveys effectiveness",
  "patient-engagement": "Patient engagement",
  "platform-effectiveness": "Platform effectiveness",
  "reputation-management": "Reputation management",
  "popularity": "Popularity",
};

const frequencies = ['daily', 'weekly', 'monthly']

const reportTypes = Object.keys(types);

module.exports = {
  reportTypes,
  frequencies
};
