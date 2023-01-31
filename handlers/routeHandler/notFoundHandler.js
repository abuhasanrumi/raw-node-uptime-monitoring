// Title: Not Found handler
// Desription: 404 Not Found handler
// Author: Abu Hasan Rumi
// Date: 31/01/2023

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: 'Your request url was not found',
    });
};

module.exports = handler;
