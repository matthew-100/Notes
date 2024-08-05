import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

export interface SignUpBody {
  username: string;
  email: string;
  password: string;
}

export interface LoginBody {
  username: string;
  password: string;
}

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId)
      .select("+email")
      .exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password)
      throw createHttpError(400, "Parameters missing");
    const existingUsername = await UserModel.findOne({ username }).exec();
    if (existingUsername) throw createHttpError(409, "Username already exists");
    const existingEmail = await UserModel.findOne({ email }).exec();
    if (existingEmail) throw createHttpError(409, "Email already exists");
    const passwordHashed = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      username,
      email,
      password: passwordHashed,
    });

    req.session.userId = newUser._id;
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    const user = await UserModel.findOne({ username })
      .select("+password +email")
      .exec();
    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw createHttpError(401, "Invalid Credentials");
    }
    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  req.session.destroy((error) => {
    if (error) next(error);
    else {
      res.sendStatus(200);
    }
  });
};
