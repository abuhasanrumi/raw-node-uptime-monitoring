// Title: Uptime Monitoring Application
// Desription: A RESTful API to monitor up or down time of user defined links
// Author: Abu Hasan Rumi
// Date: 31/01/2023

// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');

// app object - module scaffolding
const app = {};

// configuration
app.config = {
    port: 3000,
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Listening to port ${app.config.port}`);
    });
};

// handle request response
app.handleReqRes = handleReqRes;

// start server
app.createServer();
