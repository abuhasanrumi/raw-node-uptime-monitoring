// Title: User handler
// Desription: User handler
// Author: Abu Hasan Rumi
// Date: 01/02/2023

// dependencies
const data = require("../../lib/data")
const { hash } = require('../../helpers/utilities')
const { parseJSON } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete']
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback)
    } else {
        callback(405)
    }
};

handler._users = {}

handler._users.post = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    const tosAgreement = typeof (requestProperties.body.tosAgreement) === 'boolean' && requestProperties.body.tosAgreement ? requestProperties.body.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // making sure that user doesn't already exists 
        data.read('users', phone, (err, user) => {
            if (err) {
                let userObject = {
                    firstName, lastName, phone, password: hash(password), tosAgreement
                }

                // store the user to DB
                data.create('users', phone, userObject, (err) => {
                    if (!err) {
                        callback(200, {
                            message: "User was created successfully"
                        })
                    } else {
                        callback(500, {
                            error: "Could not create user"
                        })
                    }
                })
            } else {
                callback(500, {
                    error: "User already exists / there was an error in server side"
                })
            }
        })
    } else {
        callback(400, {
            error: "You have a problem in your request"
        })
    }

}

handler._users.get = (requestProperties, callback) => {
    // check if the phone no is valid
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;

    if (phone) {
        // lookup the user 
        data.read('users', phone, (err, u) => {
            const user = { ...parseJSON(u) }
            if (!err && user) {
                delete user.password
                callback(200, user)
            } else {
                callback(404, {
                    error: "Requested user wasn't found"
                })
            }
        })
    } else {
        callback(404, {
            error: "Requested user wasn't found"
        })
    }
}

handler._users.put = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone) {
        if (firstName || lastName || password) {
            // look up the user
            data.read('users', phone, (err, uData) => {
                const userData = { ...parseJSON(uData) }
                if (!err && userData) {
                    if (firstName) {
                        userData.firstName = firstName;
                    } if (lastName) {
                        userData.lastName = lastName;
                    } if (password) {
                        userData.password = hash(password);
                    }

                    // store to database
                    data.update('users', phone, userData, (err) => {
                        if (!err) {
                            callback(200, {
                                message: "User was updated successfully!"
                            })
                        } else {
                            callback(500, {
                                error: "There was a problem in server side"
                            })
                        }
                    })
                } else {
                    callback(400, {
                        error: "Your informations are not matching, please try again"
                    })
                }
            })
        } else {
            callback(400, {
                error: "Your informations are not matching, please try again"
            })
        }
    } else {
        callback(400, {
            error: "Invalid phone number, please try again"
        })
    }
}

handler._users.delete = (requestProperties, callback) => {
    // check if the phone no is valid
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;

    if (phone) {
        // lookup the user
        data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                data.delete('users', phone, (err) => {
                    if (!err) {
                        callback(200, {
                            message: "User deleted successfully"
                        })
                    } else {
                        callback(500, {
                            error: "There was a server side error"
                        })
                    }
                })
            } else {
                callback(500, {
                    error: "There was a server side error"
                })
            }
        })

    } else {
        callback(400, {
            error: "There was a problem in your request"
        })
    }
}

module.exports = handler;
