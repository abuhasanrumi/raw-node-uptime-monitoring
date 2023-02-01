// dependencies

// module scaffolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'gasdasdehsdjdgsdaer',
    maxChecks: 5,
    twilio: {
        fromPhone: '+15005550006',
        accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
        authToken: "9455e3eb3109edc12e3d8c92768f7a67"
    }
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'uransdfdterkhjdfeaa',
    maxChecks: 5,
    twilio: {
        fromPhone: '+15005550006',
        accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
        authToken: "9455e3eb3109edc12e3d8c92768f7a67"
    }
};

// determine which enviornment was passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport = typeof environments[currentEnvironment] === 'object'
    ? environments[currentEnvironment]
    : environments.staging;

// export module
module.exports = environmentToExport;
