const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Experinio API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://bitbucket.org/jnngroup/experinio-api/src/master//LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
