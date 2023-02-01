// Title: Token handler
// Desription: Handler to handle token related routes
// Author: Abu Hasan Rumi
// Date: 01/02/2023

// dependencies
const data = require("../../lib/data")
const { hash } = require('../../helpers/utilities')
const { createRandomStr } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const { token } = require("../../routes");

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete']
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback)
    } else {
        callback(405)
    }
};

handler._token = {}

handler._token.post = (requestProperties, callback) => {
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone && password) {
        data.read('users', phone, (err1, userData) => {
            let hashedPass = hash(password)
            if (hashedPass === parseJSON(userData).password) {
                const tokenID = createRandomStr(20)
                const expires = Date.now() + 60 + 60 + 1000;
                let tokenObject = {
                    phone: phone,
                    id: tokenID,
                    expires: expires
                }

                // store the token
                data.create('tokens', tokenID, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, tokenObject)
                    } else {
                        callback(500, {
                            error: "Server side Error"
                        })
                    }
                })
            } else {
                callback(400, {
                    error: "Password is not valid"
                })
            }
        })
    } else {
        callback(400, {
            error: "You have a problem in your request"
        })
    }
}

handler._token.get = (requestProperties, callback) => {
    // check if the token id is valid
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    if (token) {
        // lookup the token 
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) }
            if (!err && token) {
                callback(200, token)
            } else {
                callback(404, {
                    error: "Requested token wasn't found"
                })
            }
        })
    } else {
        callback(404, {
            error: "Requested token wasn't found"
        })
    }
}

handler._token.put = (requestProperties, callback) => {

}

handler._token.delete = (requestProperties, callback) => {

}

module.exports = handler;
