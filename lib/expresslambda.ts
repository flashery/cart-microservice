import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';

export class ExpressLambda extends NodejsFunction {
  constructor(
    scope: Construct,
    id: string,
    environment: string,
    envVars: { [key: string]: string }
  ) {
    super(scope, id, {
      entry: path.join(__dirname, '../src/lambda.ts'),
      handler: 'handler',
      bundling: {
        externalModules: ['aws-sdk']
      },
      environment: envVars,
      timeout: Duration.seconds(600),
      memorySize: environment === 'production' ? 1786 : 128
    });
  }
}
