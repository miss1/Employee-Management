const mongoose = require("mongoose");
const Document = require("../../models/Document");
const resolver = {
  Query: {
    document: async (parent, { id }, context) => {
      if (context.user == null) {
        throw new Error('Unauthorized');
      }

      try {
        const docID = new mongoose.Types.ObjectId(id);
        const document = await Document.findById(docID);

        const userID = new mongoose.Types.ObjectId(context.user._id);
        if (context.user.role === 'employee' && document.user !== userID) {
          throw new Error('Unauthorized');
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
        const feedback = [
          'Waiting for HR to approve your OPT Receipt',
          'Waiting for HR to approve your OPT EAD',
          'Waiting for HR to approve and sign your I-983',
          'Waiting for HR to approve your I-20'
        ];
        const params = {
          step,
          status: 'pending',
          feedback: feedback[step - 1],
          [fileName[step - 1]]: file,
        }

        return await Document.findByIdAndUpdate(document._id, params, { new: true, runValidators: true });
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    }
  }
};

module.exports = resolver;