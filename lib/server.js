// Title: Uptime Monitoring Application - Server Library
// Desription: Server related files
// Author: Abu Hasan Rumi
// Date: 01/02/2023

// dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
const environment = require('../helpers/environments');

// server object - module scaffolding
const server = {};

// configuration 
server.config = {
    port: 3000
}

// create server
server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`);
    });
};

// handle request response
server.handleReqRes = handleReqRes;

// start server
server.init = () => {
    server.createServer()
}

// export 
module.exports = server
