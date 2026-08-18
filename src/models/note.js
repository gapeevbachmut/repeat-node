import { Schema, model } from 'mongoose';
import { noteTags } from '../constants/noteTags.js';

const noteScema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false,
      default: '',
    },
    tag: {
      type: String,
      required: false,
      default: 'Todo',
      enum: noteTags,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Note = model('Note', noteScema);
