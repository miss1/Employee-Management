const Registration = require("../../models/Registration");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const resolver = {
  Query: {
    login: async (parent, { username, password }) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error('The username does not exist');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        const token = jwt.sign(
          { id: user._id, role: user.role, email: user.email },
          process.env.SECRET_KEY,
          {expiresIn: "24h"}
        );

        return {
          token,
          user
        }
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
    usersByStatus: async (parent, { status }, context) => {
      if (context.user == null || context.user.role !== 'HR') {
        throw new Error('Unauthorized');
      }

      try {
        return await User.find({ status: 0 }).populate('information').populate('documents');
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
  },
  Mutation: {
    register: async (parent, { username, password, token }) => {
      try {
        const decoded = jwt.verify(token, process.env.REGISTRATION_KEY);

        const registrationDoc = await Registration.findOne({ token });
        if (!registrationDoc || decoded.email !== registrationDoc.email) {
          throw new Error('Invalid token');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
          username,
          email: registrationDoc.email,
          role: 'Employee',
          password: hashedPassword,
        });

        await user.save();

        return 'Registration success, you can login.';
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    }
  }
};

module.exports = resolver;