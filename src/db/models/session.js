import { model, Schema } from 'mongoose';
import { UserCollection } from './user.js';

const sessionSchema = new Schema(
  {
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
    userId: {
      type: Schema.ObjectId,
      required: true,
      ref: UserCollection,
      unique: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const SessionCollection = model('sessions', sessionSchema);
