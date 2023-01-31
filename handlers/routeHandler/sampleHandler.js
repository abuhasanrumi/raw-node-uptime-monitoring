// Title: Sample handler
// Desription: Sample handler
// Author: Abu Hasan Rumi
// Date: 31/01/2023

// module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    callback(200, {
        message: 'this is a sample url',
    });
};

module.exports = handler;
