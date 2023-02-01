// Title: Uptime Monitoring Application
// Desription: A RESTful API to monitor up or down time of user defined links
// Author: Abu Hasan Rumi
// Date: 31/01/2023

// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const { sendTwilioSms } = require('./helpers/notifications');

// app object - module scaffolding
const app = {};

// Twilio Testing - remove later
sendTwilioSms('01534277453', 'Hello', (err) => {
    console.log("Error", err)
})


// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`);
    });
};

// handle request response
app.handleReqRes = handleReqRes;

// start server
app.createServer();
