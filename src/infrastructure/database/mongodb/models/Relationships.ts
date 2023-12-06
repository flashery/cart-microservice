import { Schema } from 'mongoose';

export const Relationships = new Schema({
  /**
   * Schema for this in the docs has contains reserved keyword so it is not working when try to save
   * Decided to put an empty object for this properties
   */
  belongsToConsumer: {},
  jobAddress: {}
});
