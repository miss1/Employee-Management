const mongoose = require("mongoose");
const Document = require("../../models/Document");
const Information = require("../../models/Information");
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
    },
    unfinishedDocument: async (parent, arg, context) => {
      if (context.user == null || context.user.role !== 'hr') {
        throw new Error('Unauthorized');
      }

      try {
        const documents = await Document.find({
          $or: [
            { step: { $ne: 4 } },
            { step: 4, status: { $ne: 'approved' } }
          ]
        });

        const fileName = ['optReceipt', 'optEAD', 'i983', 'i20'];
        const fileType = ['OPT.pdf', 'EAD.pdf', 'I983.pdf', 'I20.pdf'];

        const results = await Promise.all(documents.map(async (document) => {
          const info = await Information.findOne({ user: document.user });

          let currentFile = '';
          if (document.status === 'pending') {
            currentFile = fileType[document.step - 1];
          } else if (document.status === 'approved') {
            currentFile = document.step !== 4 ? fileType[document.step] : ''
          } else {
            currentFile = fileType[document.step - 1];
          }

          return {
            id: document._id,
            name: info.firstName + ' ' + info.lastName,
            workAuth: info.workAuth,
            workAuthStart: info.workAuthStart,
            workAuthEnd: info.workAuthEnd,
            nextStep: document.status === 'pending' ? 0 : 1,
            file: document.status === 'pending' ? document[fileName[document.step - 1]] : '',
            fileType: currentFile
          };
        }));

        return results;
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

        let currentStep = step;
        if (document.step === step && document.status === 'rejected') {
          currentStep = step;
        } else if (document.step === step - 1 && document.status === 'approved') {
          currentStep = step - 1;
        } else {
          throw new Error('You can not upload new file now');
        }

        const fileName = ['optReceipt', 'optEAD', 'i983', 'i20'];
        const params = {
          step,
          status: 'pending',
          feedback: '',
          [fileName[currentStep]]: file,
        }

        await Document.findByIdAndUpdate(document._id, params, { new: true, runValidators: true });

        return "Upload Successfully";
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
    approveDocument: async (parent, { id }, context) => {
      if (context.user == null || context.user.role !== 'hr') {
        throw new Error('Unauthorized');
      }

      try {
        const docId = new mongoose.Types.ObjectId(id);
        const document = await Document.findById(docId);

        if (document.status !== 'pending') {
          throw new Error('Can not approve');
        }

        await Document.findByIdAndUpdate(docId, { status: 'approved' });

        return "Approved Successfully";
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },

    rejectDocument: async (parent, { id, feedback }, context) => {
      if (context.user == null || context.user.role !== 'hr') {
        throw new Error('Unauthorized');
      }

      try {
        const docId = new mongoose.Types.ObjectId(id);
        const document = await Document.findById(docId);

        if (document.status !== 'pending') {
          throw new Error('Can not reject');
        }

        await Document.findByIdAndUpdate(docId, { status: 'rejected', feedback });

        return "Rejected Successfully";
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    }
  }
};

module.exports = resolver;