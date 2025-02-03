import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';

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
    accessToken: crypto.randomBytes(50).toString('base64'),
    refreshToken: crypto.randomBytes(50).toString('base64'),
    userId: user._id,
    refreshTokenValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    accessTokenValidUntil: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
  });

  return session;
};

export const logoutUser = async ({ sessionToken, sessionId }) => {
  await SessionCollection.deleteOne({ refreshToken: sessionToken, sessionId });
};
