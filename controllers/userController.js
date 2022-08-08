const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const customError = require("../errors");
const {createTokenUser,attachCookiesToResponse,checkPermissions}=require('../utils')

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};


const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new customError.NotFoundError(`No user with id :${req.params.id}`);
  }
  checkPermissions(req.user,user._id)
  res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};


const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new customError.BadRequestError(`please provide both values`);
  }
  const user = await User.findOne(
    { _id: req.user.userId }
  );
  user.email=email
  user.name=name

  await user.save()
  const tokenUser=createTokenUser(user)
  attachCookiesToResponse({res,user:tokenUser})
  res.status(StatusCodes.OK).json({user:tokenUser})
};


const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new customError.BadRequestError(`please provide both values`);
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new customError.UnauthenticatedError("invalid credentials");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "succeess! password updated" });
};
const updateUserRole = async (req, res) => {
    const { oldRole, newRole,id } = req.body;
    if (!oldRole || !newRole) {
      throw new customError.BadRequestError(`please provide both values`);
    }
    
    const user = await User.findOne({ _id: id });
    console.log(user)
    
    user.role = newRole;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: "succeess! Role updated" });
  };


module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  updateUserRole,
};
