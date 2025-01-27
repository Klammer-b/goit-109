import { model, Schema } from 'mongoose';
import { GENDERS } from '../../constants/gender.js';

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: Object.values(GENDERS) },
    avgMark: { type: Number, required: true },
    onDuty: { type: Boolean, default: false, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const StudentCollection = model('students', studentSchema);
