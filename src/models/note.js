import { Schema, model } from 'mongoose';

const noteScema = new Schema({});

export const Note = model('Note', noteScema);
