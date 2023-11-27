const jwt = require("jsonwebtoken");

const User = require("../Model/accountModel");
const Token = require("../Model/tokenModel");
const accountModel = require("../Model/accountModel");

const signup = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signup(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOption);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    address: req.body.address,
    privatekey: req.body.privatekey,
    mnemonic: req.body.mnemonic,
  });
  createSendToken(newUser, 201, req, res);
};


exports.login = async (req, res, next) => {
    const { address, password } = req.body;
    // 1) Check if email and password exist
    if (!address || !password) {
        return next(new AppError("Please provide email and password!", 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ address }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    }
    // 3) If everything ok, send token to client
    createSendToken(user, 200, req, res);
    };
