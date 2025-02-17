import nodemailer from 'nodemailer';
import { getEnv } from './getEnv.js';
import { ENV_VARS } from '../constants/env.js';
import createHttpError from 'http-errors';

const transport = nodemailer.createTransport({
  host: getEnv(ENV_VARS.SMTP_HOST),
  port: getEnv(ENV_VARS.SMTP_PORT),
  auth: {
    user: getEnv(ENV_VARS.SMTP_USER),
    pass: getEnv(ENV_VARS.SMTP_PASS),
  },
});

export const sendEmail = async (options) => {
  try {
    return await transport.sendMail({
      to: options.to,
      subject: options.subject,
      from: options.from,
      html: options.html,
    });
  } catch (err) {
    console.error(err);
    throw createHttpError(500, 'Failed to send an email');
  }
};
