#!/usr/bin/env node
import dotenv from 'dotenv';
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import GitBranch from 'git-branch';
import { CartApiStack } from '../lib/cartapistack';
import { CDKContext } from '../types';
dotenv.config();

const createStacks = async () => {
  try {
    const app = new cdk.App();
    const context = await getContext(app);

    const tags: any = {
      Environment: context.environment
    };

    const stackProps: cdk.StackProps = {
      env: {
        region: context.region,
        account: process.env.ACCOUNT_NUMBER || ''
      },
      stackName: `${context.appName}-stack-${context.environment}`,
      description: `This is the ${context.environment} stack of ${context.appName}`,
      tags
    };

    new CartApiStack(
      app,
      `${context.appName}-stack-${context.environment}`,
      stackProps,
      context
    );
  } catch (err) {
    console.log(err);
  }
};

export const getContext = async (app: cdk.App): Promise<CDKContext> => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentBranch = await GitBranch();
      console.log(`Current git branch: ${currentBranch}`);

      const environment = app.node
        .tryGetContext('environments')
        .find((e: any) => e.branchName === currentBranch);
      console.log(`Environment: `);
      console.log(JSON.stringify(environment, null, 2));

      const globals = app.node.tryGetContext('globals');
      console.log(`Globals:`);
      console.log(JSON.stringify(globals, null, 2));

      return resolve({ ...globals, ...environment });
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

createStacks();
