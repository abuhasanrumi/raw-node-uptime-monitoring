// Title: Sample Handler
// Desription: Sample Handler
// Author: Abu Hasan Rumi
// Date: 31/01/2023

// dependencies
const { sampleHandler } = require('./handlers/routeHandler/sampleHandler');
const { userHandler } = require('./handlers/routeHandler/userHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
};

module.exports = routes;
