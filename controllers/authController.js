const { StatusCodes } = require("http-status-codes");
const User = require('../models/User')
const customError = require("../errors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  attachCookiesToResponse,
} = require("../utils");

const register = async (req, res) => {
  const user = await User.create(req.body);

  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).send({ user: tokenUser });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new customError.BadRequestError(
      "please provide username and password"
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new customError.UnauthenticatedError("invalid input");
  }
  const correctPassword = await user.comparePassword(password);
  if (!correctPassword) {
    throw new customError.UnauthenticatedError("wrong password");
  }

  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).send({ user: tokenUser });
};
const logout = async (req, res) => {
  res.cookie('token','logout',{
    httpOnly:true,
    expires:new Date(Date.now())
  })
  res.status(StatusCodes.OK).json({msg:'user logged out!'})
};

module.exports = { login, logout, register };
