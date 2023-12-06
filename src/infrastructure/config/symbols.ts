import dotenv from 'dotenv';
dotenv.config();

// symbols are used to store environment variables, feature flags, messages and other constants

const production = process.env.NODE_ENV === 'production';
console.log(production);
/**
 * External API's URLs
 */
const externalAPI = {
  LEGACY_API_URL: production
    ? process.env.LEGACY_API_PROD_URL
    : process.env.LEGACY_API_DEV_URL,
  SERVICE_MS_URL: production
    ? process.env.SERVICE_MS_PROD_URL
    : process.env.SERVICE_MS_DEV_URL,
  GET_CONSUMER_ENDPOINT: process.env.GET_CONSUMER_ENDPOINT,
  GET_ADDRESS_ENDPOINT: process.env.GET_ADDRESS_ENDPOINT
};

/**
 * Features flags/switches
 */
const features = {
  USE_ADDRESS_MS: process.env.USE_ADDRESS_MS === 'true'
};

const adminFee = {
  MATERIAL_MARKUP_PTC: Number(process.env.MATERIAL_MARKUP_PTC || 0),
  SERVICE_MARKUP_PTC: Number(process.env.SERVICE_MARKUP_PTC || 0)
};

export { externalAPI, features, adminFee };
