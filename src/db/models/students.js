import { model, Schema } from 'mongoose';

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    avgMark: { type: Number, required: true },
    onDuty: { type: Boolean, default: false, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const StudentCollection = model('students', studentSchema);
