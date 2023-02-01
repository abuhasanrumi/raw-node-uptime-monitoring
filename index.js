// Title: Project Initial File
// Desription: Initial file to start the node server and workers
// Author: Abu Hasan Rumi
// Date: 01/02/2023

// dependencies
const server = require('./lib/server')
const worker = require('./lib/worker')

// app object - module scaffolding
const app = {};

app.init = () => {
    // start the server
    server.init()

    // start the workers
    worker.init()
}

app.init()

// export the app 
module.exports = app
