const mongoose = require("mongoose");
const Document = require("../../models/Document");
const resolver = {
  Query: {
    document: async (parent, arg, context) => {
      if (context.user == null || context.user.role !== 'employee') {
        throw new Error('Unauthorized');
      }

      try {
        const userID = new mongoose.Types.ObjectId(context.user._id);
        const document = await Document.findOne({ user: userID });

        if (!document) {
          throw new Error('The document does not exist');
        }

        return document;
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    }
  },
  Mutation: {
    updateDocument: async (parent, { step, file }, context) => {
      if (context.user == null || context.user.role !== 'employee') {
        throw new Error('Unauthorized');
      }

      try {
        const userID = new mongoose.Types.ObjectId(context.user._id);
        const document = await Document.findOne({ user: userID });
        if (!document) {
          throw new Error('The document does not exist');
        }

        if (document.step !== step - 1 || document.status !== 'approved') {
          throw new Error('You can not upload new file now');
        }

        const fileName = ['optReceipt', 'optEAD', 'i983', 'i20'];
        const params = {
          step,
          status: 'pending',
          feedback: '',
          [fileName[step - 1]]: file,
        }

        await Document.findByIdAndUpdate(document._id, params, { new: true, runValidators: true });

        return "Upload Successfully";
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    }
  }
};

module.exports = resolver;