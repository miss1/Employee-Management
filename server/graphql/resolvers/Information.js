const Information = require('../../models/Information');
const User = require("../../models/User");
const Registration = require('../../models/Registration');
const mongoose = require("mongoose");

const updateInformationField = async (user, input) => {
  if (user == null || user.role !== 'employee') {
    throw new Error('Unauthorized');
  }

  try {
    const userID = new mongoose.Types.ObjectId(user._id);
    const info = await Information.findOneAndUpdate({user: userID}, input, { new: true, runValidators: true });
    if (!info) {
      throw new Error('Information not found');
    }
    return info;
  } catch (e) {
    throw new Error(e.message || 'error');
  }
};

const resolver = {
  Query: {
    // get info by INFO ID
    information: async (parent, { id }, context) => {
      if (context.user == null || context.user.role !== 'hr') {
        throw new Error('Unauthorized');
      }

      try {
        const infoID = new mongoose.Types.ObjectId(id);
        const information = await Information.findById(infoID);
        return information;
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
    // get info by user id
    userInformation: async (parent, args, context) => {
      if (context.user == null || context.user.role !== 'employee') {
        throw new Error('Unauthorized');
      }

      try {
        const userID = new mongoose.Types.ObjectId(context.user._id);
        const information = await Information.findOne({ user: userID });
        return information;
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
    // get all info
    allInformation: async (parent, { search }, context) => {
      if (context.user == null || context.user.role !== 'hr') {
        throw new Error('Unauthorized');
      }

      try {
        let filter = {};
        if (search) {
          const regex = new RegExp(search, 'i');
          filter = {
            $or: [
              { firstName: regex },
              { lastName: regex },
              { preferredName: regex }
            ]
          }
        }
        return await Information.find(filter).exec();
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
    // get applications by onboarding status
    applications: async (parent, { onboarding }, context) => {
      if (context.user == null || context.user.role !== 'hr') {
        throw new Error('Unauthorized');
      }

      try {
        return await Information.find({ onboarding }).exec();
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
    // get information by work auth
    visaInformation: async (parent, { workAuth, search }, context) => {
      if (context.user == null || context.user.role !== 'hr') {
        throw new Error('Unauthorized');
      }

      try {
        let filter = {workAuth};
        if (search) {
          const regex = new RegExp(search, 'i');
          filter = {
            workAuth,
            $or: [
              { firstName: regex },
              { lastName: regex },
              { preferredName: regex }
            ]
          }
        }
        return await Information.find(filter);
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    }
  },
  Mutation: {
    // submit a application
    createInformation: async (parent, { input }, context) => {
      if (context.user == null || context.user.role !== 'employee') {
        throw new Error('Unauthorized');
      }

      try {
        // create application
        const userID = new mongoose.Types.ObjectId(context.user._id);
        input.user = userID;
        input.onboarding = "pending";
        input.feedback = 'Please wait for HR to review your application.';
        const information = new Information(input);
        await information.save();

        // update registration status
        const user = await User.findById(userID);
        await Registration.findOneAndUpdate({ email: user.backupEmail }, { submitted: true });

        return 'Onboarding applications submitted successfully';
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
    // update application
    updateInformation: async (parent, { input }, context) => {
      if (context.user == null || context.user.role !== 'employee') {
        throw new Error('Unauthorized');
      }

      try {
        const userID = new mongoose.Types.ObjectId(context.user._id);

        input.onboarding = "pending";
        input.feedback = 'Please wait for HR to review your application.';

        const information = await Information.findOneAndUpdate({ user: userID }, input, { new: true, runValidators: true });
        if (!information) {
          throw new Error('Information not found');
        }

        // update registration status
        const user = await User.findById(userID);
        await Registration.findOneAndUpdate({ email: user.backupEmail }, { submitted: true });

        return 'Onboarding applications submitted successfully';
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
    // employee: update information
    updateName: async (parent, { input }, context) => {
      return await updateInformationField(context.user, input);
    },
    updateAddress: async (parent, { input }, context) => {
      return await updateInformationField(context.user, input);
    },
    updateContact: async (parent, { input }, context) => {
      return await updateInformationField(context.user, input);
    },
    updateEmployment: async (parent, { input }, context) => {
      return await updateInformationField(context.user, input);
    },
    updateEmergencyContact: async (parent, { input }, context) => {
      return await updateInformationField(context.user, input);
    },
  }
};

module.exports = resolver;