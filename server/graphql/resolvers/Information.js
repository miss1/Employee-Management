const Information = require('../../models/Information');
const User = require("../../models/User");
const Registration = require('../../models/Registration');
const mongoose = require("mongoose");

const updateInformationField = async (user, input) => {
  if (user == null || user.role !== 'Employee') {
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
    information: async (parent, { id }, context) => {
      if (context.user == null) {
        throw new Error('Unauthorized');
      }

      try {
        const infoID = new mongoose.Types.ObjectId(id);
        const information = await Information.findById(infoID);

        const userID = new mongoose.Types.ObjectId(context.user._id);
        if (context.user.role === 'Employee' && information.user !== userID) {
          throw new Error('Unauthorized');
        }

        return information;
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
    allInformation: async (parent, { search }, context) => {
      if (context.user == null || context.user.role !== 'HR') {
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
        return await Information.find(filter);
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
  },
  Mutation: {
    createInformation: async (parent, { input }, context) => {
      if (context.user == null || context.user.role !== 'Employee') {
        throw new Error('Unauthorized');
      }

      try {
        // create application
        const userID = new mongoose.Types.ObjectId(context.user._id);
        input.user = userID;
        const information = new Information(input);
        await information.save();

        // update application status
        const userInfo = {
          onboarding: 'pending',
          feedback: 'Please wait for HR to review your application.',
          information: information._id,
        };
        await User.findByIdAndUpdate(userID, userInfo);

        // update registration status
        await Registration.findOneAndUpdate({ email: context.user.email }, { submitted: true });

        return 'Onboarding applications submitted successfully';
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
    updateInformation: async (parent, { input }, context) => {
      if (context.user == null || context.user.role !== 'Employee') {
        throw new Error('Unauthorized');
      }

      try {
        const userID = new mongoose.Types.ObjectId(context.user._id);

        const information = await Information.findOneAndUpdate({ user: userID }, input, { new: true, runValidators: true });
        if (!information) {
          throw new Error('Information not found');
        }

        // update application status
        const userInfo = {
          onboarding: 'pending',
          feedback: 'Please wait for HR to review your application.',
          information: information._id,
        };
        await User.findByIdAndUpdate(userID, userInfo);

        // update registration status
        await Registration.findOneAndUpdate({ email: context.user.email }, { submitted: true });

        return 'Onboarding applications submitted successfully';
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
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