const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require("dotenv");
const constants = require("../constant");
dotenv.config();

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_CODE);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res
      .status(constants.statusCodes.unauthorizedcode)
      .send(constants.errormsgs.unauthorizedmsg);
  }
};

module.exports = auth;
