const user = require('./User');
const registration = require('./Registration');
const information = require('./Information');
const document = require('./Document');

const typeDefs = [user, registration, information, document];
module.exports = typeDefs;