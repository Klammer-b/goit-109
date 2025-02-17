import { OAuth2Client } from 'google-auth-library';
import { getEnv } from './getEnv.js';
import { ENV_VARS } from '../constants/env.js';
import createHttpError from 'http-errors';

export const oAuth2Client = new OAuth2Client({
  clientId: getEnv(ENV_VARS.GOOGLE_CLIENT_ID),
  clientSecret: getEnv(ENV_VARS.GOOGLE_CLIENT_SECRET),
  redirectUri: getEnv(ENV_VARS.GOOGLE_REDIRECT_URI),
});

export const verifyGoogleOAuthCode = async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);

    const idToken = tokens.id_token;

    if (!idToken) {
      throw createHttpError(401);
    }

    const ticket = await oAuth2Client.verifyIdToken({ idToken });

    return ticket.getPayload();
  } catch (err) {
    console.error(err.message);
    throw createHttpError(500, 'Failed to authenticate with google');
  }
};
