import { Schema } from 'mongoose';

export const Properties = new Schema({
  createdService: String,
  createdBy: String,
  createdDate: String,
  modifiedService: String,
  modifiedBy: String,
  modifiedDate: String,
  __v: Number,
  generation: Number
});
