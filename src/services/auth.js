import createHttpError from 'http-errors';
import Handlebars from 'handlebars';
import fs from 'node:fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';
import {
  ACCESS_TOKEN_LIVE_TIME,
  REFRESH_TOKEN_LIVE_TIME,
} from '../constants/time.js';
import { sendEmail } from '../utils/sendEmail.js';
import { getEnv } from '../utils/getEnv.js';
import { ENV_VARS } from '../constants/env.js';
import path from 'node:path';
import { TEMPLATES_DIR_PATH } from '../constants/path.js';

const resetEmailTemplate = fs
  .readFileSync(path.join(TEMPLATES_DIR_PATH, 'reset-password-email.html'))
  .toString();

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

export const requestResetPasswordEmail = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign(
    { sub: user._id, email },
    getEnv(ENV_VARS.JWT_SECRET),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordLink = `${getEnv(ENV_VARS.FRONTEND_DOMAIN)}/reset-password?token=${token}`;

  const template = Handlebars.compile(resetEmailTemplate);

  const html = template({
    name: user.name,
    link: resetPasswordLink,
  });

  await sendEmail({
    to: email,
    from: getEnv(ENV_VARS.SMTP_FROM),
    subject: 'Reset your password!',
    html,
  });
};

export const resetPassword = async ({ password, token }) => {
  let payload;
  try {
    payload = jwt.verify(token, getEnv(ENV_VARS.JWT_SECRET));
  } catch (err) {
    console.error(err.message);
    throw createHttpError(401, 'JWT token is invalid or expired');
  }

  const user = await UserCollection.findById(payload.sub);

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await UserCollection.findByIdAndUpdate(user._id, {
    password: hashedPassword,
  });
};
