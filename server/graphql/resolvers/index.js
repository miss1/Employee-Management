const { merge } = require('lodash');
const user = require('./User');
const registration = require('./Registration');
const information = require('./Information');
const document = require('./Document');

const resolvers = merge(registration, user, information, document);
module.exports = resolvers;