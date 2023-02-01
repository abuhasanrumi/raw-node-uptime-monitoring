// Title: Check handler
// Desription: Handler to handle user defined checks
// Author: Abu Hasan Rumi
// Date: 01/02/2023

// dependencies
const data = require("../../lib/data")
const { parseJSON, createRandomStr } = require('../../helpers/utilities')
const { maxChecks } = require('../../helpers/environments');
const tokenHandler = require('./tokenHandler');

// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete']
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback)
    } else {
        callback(405)
    }
};

handler._check = {}

handler._check.post = (requestProperties, callback) => {
    // validate inputs
    const protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    const url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    const method = typeof (requestProperties.body.method) === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    const successCodes = typeof (requestProperties.body.successCodes) === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    const timeOutSeconds = typeof (requestProperties.body.timeOutSeconds) === 'number' && requestProperties.body.timeOutSeconds % 1 === 0 && requestProperties.body.timeOutSeconds >= 1 && requestProperties.body.timeOutSeconds <= 5 ? requestProperties.body.timeOutSeconds : false;


    if (protocol && url && method && successCodes && timeOutSeconds) {
        const token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

        // lookup user phone from the token
        data.read('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                const userPhone = parseJSON(tokenData).phone

                // lookup the user
                data.read('users', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
                            if (tokenIsValid) {
                                const userObj = parseJSON(userData)
                                const userChecks = typeof (userObj.checks) === 'object' && userObj.checks instanceof Array ? userObj.checks : [];

                                if (userChecks.length < maxChecks) {
                                    const checkID = createRandomStr(20)
                                    const checkObj = {
                                        id: checkID,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeOutSeconds
                                    }

                                    // store the obj
                                    data.create('checks', checkID, checkObj, (err3) => {
                                        if (!err3) {
                                            // add checkID to the users object
                                            userObj.checks = userChecks
                                            userObj.checks.push = checkID

                                            // save the new user data
                                            data.update('users', userPhone, userObj, (err4) => {
                                                if (!err4) {
                                                    // return the data about the new check 
                                                    callback(200, checkObj)
                                                } else {
                                                    callback(500, {
                                                        error: "Problem in server side"
                                                    })
                                                }
                                            })
                                        } else {
                                            callback(500, {
                                                error: "Problem in server side"
                                            })
                                        }
                                    })
                                } else {
                                    callback(401, {
                                        error: "User has already reached max checks limit"
                                    })
                                }

                            } else {
                                callback(403, {
                                    error: "Authentication Error"
                                })
                            }
                        })
                    } else {
                        callback(403, {
                            error: "User not found"
                        })
                    }
                })
            } else {
                callback(403, {
                    error: "Authentication Error"
                })
            }
        })
    } else {
        callback(400, {
            error: "You have a problem in your input"
        })
    }

}

handler._check.get = (requestProperties, callback) => {
    // check if the token id is valid
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    if (id) {
        // lookup the check
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                // lookup token
                const token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

                // verify token
                tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        callback(200, parseJSON(checkData))
                    } else {
                        callback(403, {
                            error: 'Authentication failure',
                        });
                    }
                })
            }
            else {
                callback(500, {
                    error: 'Server side error',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
}

handler._check.put = (requestProperties, callback) => {

}

handler._check.delete = (requestProperties, callback) => {

}

module.exports = handler;
