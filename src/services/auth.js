import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';
import {
  ACCESS_TOKEN_LIVE_TIME,
  REFRESH_TOKEN_LIVE_TIME,
} from '../constants/time.js';

const createSession = () => ({
  accessToken: crypto.randomBytes(50).toString('base64'),
  refreshToken: crypto.randomBytes(50).toString('base64'),
  refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIVE_TIME), // 30 days
  accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME), // 15 minutes
});

export const registerUser = async ({ email, password, name }) => {
  let user = await UserCollection.findOne({ email });

  if (user) {
    throw createHttpError(409, 'User already registered!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await UserCollection.create({ email, password: hashedPassword, name });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw new createHttpError(404, 'User not found!');
  }

  const arePasswordsEqual = await bcrypt.compare(password, user.password);

  if (!arePasswordsEqual) {
    throw new createHttpError(401, 'Login or password is incorrect!');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const session = await SessionCollection.create({
    ...createSession(),
    userId: user._id,
  });

  return session;
};

export const logoutUser = async ({ sessionToken, sessionId }) => {
  await SessionCollection.deleteOne({
    refreshToken: sessionToken,
    _id: sessionId,
  });
};

export const refreshSession = async ({ sessionToken, sessionId }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Session token expired');
  }

  const user = await UserCollection.findById(session.userId);

  if (!user) {
    throw createHttpError(401, 'Session user is not found');
  }

  await SessionCollection.findByIdAndDelete(session._id);

  const newSession = await SessionCollection.create({
    ...createSession(),
    userId: session.userId,
  });

  return newSession;
};
