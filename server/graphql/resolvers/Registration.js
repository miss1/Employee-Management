const Registration = require('../../models/Registration');
const jwt = require("jsonwebtoken");

const resolver = {
  Query: {
    registration: async (parent, { token }, context) => {
      if (context.user == null || context.user.role !== 'HR') {
        throw new Error('Unauthorized');
      }

      try {
        return await Registration.findOne({ token });
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
    registrations: async (parent, args, context) => {
      if (context.user == null || context.user.role !== 'HR') {
        throw new Error('Unauthorized');
      }

      try {
        return await Registration.find();
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
  },
  Mutation: {
    createRegistration: async (parent, { name, email }, context) => {
      if (context.user == null || context.user.role !== 'HR') {
        throw new Error('Unauthorized');
      }

      try {
        const token = jwt.sign({ email: email }, process.env.REGISTRATION_KEY, {expiresIn: "3h"});
        const link = `http://localhost:5173/registration/${token}`;
        const registration = new Registration({
          name,
          email,
          token,
          link
        });
        await registration.save();
        return link;
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    }
  }
};

module.exports = resolver;