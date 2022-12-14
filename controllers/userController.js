const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const customError = require("../errors");
const { checkPermissions } = require("../utils");

const getAllUsers = async (req, res) => {
  const { page } = req.query;

  let filter = {
    skip: 0,
    limit: 3,
  };
  if (page) filter.skip = (+page - 1) * filter.limit;
  const users = await User.find({ role: "user" })
    .select("-password")
    .skip(filter.skip)
    .limit(filter.limit);
  res.status(StatusCodes.OK).json({ users });
};

const getAllModerators = async (req, res) => {
  const { page } = req.query;

  let filter = {
    skip: 0,
    limit: 3,
  };
  if (page) filter.skip = (+page - 1) * filter.limit;
  const moderators = await User.find({ role: "moderator" })
    .select("-password")
    .skip(filter.skip)
    .limit(filter.limit);
  res.status(StatusCodes.OK).json({ moderators });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new customError.NotFoundError(`No user with id :${req.params.id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUserRole = async (req, res) => {
  const { newRole, id } = req.body;
  if (!newRole) {
    throw new customError.BadRequestError(`please provide new user role`);
  }

  const user = await User.findOne({ _id: id });
  user.role = newRole;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "succeess! Role updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserRole,
  getAllModerators,
};
