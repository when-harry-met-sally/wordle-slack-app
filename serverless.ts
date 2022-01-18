import type { AWS } from '@serverless/typescript';

import dailyPoster from '@functions/daily-poster';
import eventListener from '@functions/event-listener';
import initListener from '@functions/init-listener';

import { EnvironmentVariableService } from "./src/types/env";

const ENVIRONMENT = new EnvironmentVariableService();
const vars = ENVIRONMENT.vars

const serverlessConfiguration: AWS = {
  service: 'wordle-bot',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      wordleScoreboardTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: ENV_VARS.wordleTable,
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      }
    }
  },
  functions: { 
    initListener,
    eventListener, 
    dailyPoster
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
