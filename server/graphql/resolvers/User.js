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

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, {
          expiresIn: "24h",
        });

        return {
          token,
          user
        }
      } catch (e) {
        throw new Error(e.message || 'error');
      }
    },
  },
  Mutation: {
    register: async (parent, { username, password, token }) => {
      try {
        const registrationDoc = await Registration.findOne({ token });
        if (!registrationDoc || Number(registrationDoc.expiresAt) < Date.now()) {
          throw new Error('Invalid or expired token');
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