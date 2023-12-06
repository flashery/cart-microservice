import mongoose, { Schema } from 'mongoose';

import { ArchivedServiceOject } from './attributes/ArchivedServiceOject';
import { CartService } from './attributes/CartService';
import { PricingSummary } from './attributes/PricingSummary';
import { PreferredTiming } from './attributes/PreferredTiming';
import { Relationships } from './Relationships';
import { Properties } from './Properties';

const CartSchema = new Schema({
  id: String,
  attributes: {
    archivedServiceObjects: [ArchivedServiceOject],
    cartServices: [CartService],
    pricingSummary: PricingSummary,
    preferredTiming: PreferredTiming
  },
  relationships: Relationships,
  properties: Properties,
  status: { type: String, default: 'active' }
});

export const CartModel = mongoose.model('Cart', CartSchema);
