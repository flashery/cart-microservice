import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { ExpressLambda } from './expresslambda';
import { Construct } from 'constructs';
import { ApiGateway } from './apigateway';
import { CDKContext } from '../types';
import { Alias, Version } from 'aws-cdk-lib/aws-lambda';
require('dotenv').config();

export class CartApiStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: StackProps,
    context?: CDKContext
  ) {
    super(scope, id, props);

    const api = new ApiGateway(this, context?.environment || 'production');

    const expressLambda = new ExpressLambda(this, 'lambda', context?.environment || 'production' , {
      MONGODB_CONNECTION_STRING:
        process.env?.[
          `MONGODB_CONNECTION_STRING_${context?.environment.toUpperCase()}`
        ] || '',
      AUTHENTICATOR_URL: process.env?.AUTHENTICATOR_URL || '',
      CATEGORY_API_URL:
        process.env?.[
          `CATEGORY_API_URL_${context?.environment.toUpperCase()}`
        ] || '',
      SECRET_KEY: process.env?.SECRET_KEY || '',
      SERVICE_MS_PROD_URL: process.env?.SERVICE_MS_PROD_URL || '',
      SERVICE_MS_DEV_URL: process.env?.SERVICE_MS_DEV_URL || '',
      LEGACY_API_DEV_URL: process.env?.LEGACY_API_DEV_URL || '',
      LEGACY_API_PROD_URL: process.env?.LEGACY_API_PROD_URL || '',
      MATERIAL_MARKUP_PTC: process.env?.MATERIAL_MARKUP_PTC || '',
      SERVICE_MARKUP_PTC: process.env?.SERVICE_MARKUP_PTC || '',
      GET_CONSUMER_ENDPOINT: process.env?.GET_CONSUMER_ENDPOINT || '',
      GET_ADDRESS_ENDPOINT: process.env?.GET_ADDRESS_ENDPOINT || '',
      NODE_ENV: context?.environment || 'production',
      // ADD NEW ENV VARIABLES HERE
    });
    
    const latestVersion = new Version(this, `lambda-${new Date().toISOString()}`, {
      lambda: expressLambda,
      removalPolicy: RemovalPolicy.RETAIN
    })

    const latestAlias = new Alias(this, "alias", {
      aliasName: 'latest',
      version: latestVersion
    })

    api.addIntegration('ANY', '/{proxy+}', latestAlias);
  }
}
