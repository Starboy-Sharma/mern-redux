import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user/set token
// route    POST /api/users/auth
// @access  public
const authUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email: email })
  console.log(user);
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    const response = { _id: user._id, email: user.email, name: user.name, createdAt: user.createdAt, updatedAt: user.updatedAt};
    res.status(200).json(response);
  } else {
    res.status(401);
    throw new Error(`Invalid email or password`);
  }

});

// @desc    Register a new user
// route    POST /api/users
// @access  public
const registerUser = asyncHandler(async (req, res) => {

  const { name, email, password } = req.body;

  const isUserExists = await User.findOne({ email: email });

  if (isUserExists) {
    res.status(400);
    throw new Error(`Email ${email} already exists`)
  }

  const user = await User.create({ email, password, name });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error(`Invalid user data`);
  }

});

// @desc    Logout user
// route    POST /api/users/logout
// @access  public
const logoutUser = asyncHandler(async (req, res) => {

  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })

  res.status(200).json({ msg: 'User logged out' });
});

// @desc    Get user profile
// route    GET /api/users/profile
// @access  private
const getUserProflie = asyncHandler(async (req, res) => {

  const user = {
    _id: req.user._id,
    email: req.user.email,
    name: req.user.name
  }
  res.status(200).json(user);
});

// @desc    Update user profile
// route    PUT /api/users/profile
// @access  private
const updateUserProflie = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user._id);

  if (user) {

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updateUserProflie._id,
      email: updatedUser.email,
      name: updatedUser.name,
    })

  } else {
    res.status(404);
    throw new Error('User not found');
  }

});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProflie,
  updateUserProflie,
};
