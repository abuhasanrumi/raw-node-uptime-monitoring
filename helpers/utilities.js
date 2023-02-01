// dependencies

// module scaffolding
const crypto = require('crypto')
const utilities = {};
const environments = require('./environments')

// parse JSON string to Object
utilities.parseJSON = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString)
    } catch {
        output = {}
    }

    return output
}

// string hashing
utilities.hash = (str) => {
    if (typeof (str) === 'string' && str.length > 0) {
        let hash = crypto
            .createHmac('sha256', environments.secretKey)
            .update(str)
            .digest('hex')
        return hash;
    }
    return false
}

// create random string
utilities.createRandomStr = (strLength) => {
    let length = strLength
    length = typeof (strLength) === 'number' && strLength > 0 ? strLength : false

    if (length) {
        const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwx1234567890'
        let output = '';
        for (let i = 1; i <= length; i += 1) {
            const randomChr = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
            output += randomChr
        }
        return output

    } else {
        return false
    }
}

// export module
module.exports = utilities;
