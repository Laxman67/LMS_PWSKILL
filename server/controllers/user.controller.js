import AppError from "../utils/error.util.js";
import emailValidator from "email-validator";
import User from "../models/user.model.js";

const cookieOption = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};

const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError("All field are reqiured", 400));
  }

  const validEmail = emailValidator.validate(email);

  if (!validEmail) {
    return next(new AppError("Email is not Valid", 400));
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return next(new AppError("email Already Exists", 400));
  }

  const user = await User.Create({
    fullName,
    email,
    password,
    avtar: {
      public_id: email,
      secure_url: "https://res.cluodinary.com",
    },
  });

  if (!user) {
    return next(
      new AppError("user registration failed, please try again", 404)
    );
  }

  //TODO :File upload

  await user.save();
  user.password = undefined;

  const token = await user.generateJWTToken();

  res.cookie("token", token, cookieOption);

  res.status(201).json({
    success: true,
    message: "User registered Successfully",
    user,
  });
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.comparePassword(password)) {
      return next(new AppError("Email or Password does'nt Match", 400));
    }

    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOption);

    res.status(200).json({
      success: true,
      message: "User loggedIn Successfully",
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};
const logout = (req, res) => {
  res.cookie("token", null, { secure: true, httpOny: true, maxAge: 0 });
  res.status(200).json({
    success: true,
    message: "User Logged Out Successfully",
  });
};

const Getprofile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await user.findById(userId);

    res.status(200).json({
      success: true,
      message: "User details",
      user,
    });
  } catch (e) {
    return next(new AppError("Failed to Fetch Profile Details", 500));
  }
};

export { register, login, logout, Getprofile };
